"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useCart } from "@/lib/store/cart";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";
import { formatDZD, cn } from "@/lib/utils";
import { DeliveryMethod } from "@/types";
import ProductImage from "@/components/ui/ProductImage";
import { ALGERIA_WILAYAS, ALGERIA_COMMUNES } from "@/lib/algeria";


export default function CheckoutPage() {

  const { lines, subtotal, clear } = useCart();
  const settings = useSiteSettings();

  const [form,setForm]=useState({
  firstName:"",
  lastName:"",
  phone:"",
  address:"",
  commune:"",
  wilaya:"" as keyof typeof ALGERIA_COMMUNES,
  postalCode:"",
});


  const [deliveryMethod,setDeliveryMethod]=useState<DeliveryMethod>("domicile");
  const [notes,setNotes]=useState("");
  const [submitting,setSubmitting]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const [orderNumber,setOrderNumber]=useState<string|null>(null);


const update=(key:keyof typeof form)=>
(e:React.ChangeEvent<HTMLInputElement|HTMLSelectElement>)=>
setForm(f=>({
  ...f,
  [key]:
    key === "wilaya"
      ? e.target.value as keyof typeof ALGERIA_COMMUNES
      : e.target.value
}));

 const changeWilaya=(e:React.ChangeEvent<HTMLSelectElement>)=>{
  const wilaya = e.target.value as keyof typeof ALGERIA_COMMUNES;

  setForm(f=>({
    ...f,
    wilaya,
    commune:""
  }));
};

  const rawShipping =
    deliveryMethod==="domicile"
    ? settings.shippingDomicile
    : settings.shippingBureau;


  const freeShipping =
    settings.freeShippingThreshold>0 &&
    subtotal()>=settings.freeShippingThreshold;


  const shippingEstimate =
    freeShipping ? 0 : rawShipping;



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if(lines.length===0) return;

    setSubmitting(true);
    setError(null);


    try {

      const res = await fetch("/api/orders",{
        method:"POST",
        headers:{
          "Content-Type":"application/json",
        },

        body:JSON.stringify({

          customer:{
            ...form,
          },


          items:lines.map((l)=>({
            productId:l.productId,
            name:l.name,
            price:l.price,
            size:l.size,
            color:l.color,
            quantity:l.quantity,
            image:l.image,
          })),


          deliveryMethod,
          notes,

        }),

      });


      const data=await res.json();


      if(!res.ok){
        throw new Error(
          data.error ?? "Erreur lors de la commande"
        );
      }


      setOrderNumber(
        data.order.orderNumber
      );

      clear();


    }catch(err){

      setError(
        err instanceof Error
        ? err.message
        : "Une erreur est survenue"
      );


    }finally{

      setSubmitting(false);

    }

  };



  if(orderNumber){

    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-5 pt-20 text-center">

        <CheckCircle2 className="h-12 w-12 text-signal"/>


        <h1 className="mt-6 font-display text-4xl uppercase md:text-5xl">
          Commande confirmée
        </h1>


        <p className="mt-3 font-mono text-sm text-ash">
          N° {orderNumber}
        </p>


        <p className="mt-4 max-w-sm text-ash">
          On te contacte très vite par téléphone pour confirmer la livraison.
          Paiement à la livraison.
        </p>


        <Link
          href="/boutique"
          className="mt-8 bg-signal px-8 py-4 font-mono text-xs uppercase"
        >
          Continuer mes achats
        </Link>

      </div>
    );

  }



  if(lines.length===0){

    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center px-5 pt-20 text-center">

        <p className="font-mono text-sm uppercase text-ash">
          Ton panier est vide
        </p>


        <Link
          href="/boutique"
          className="mt-4 font-display text-3xl uppercase text-signal"
        >
          Voir la boutique
        </Link>


      </div>
    );

  }



  return (
    <div className="px-5 pb-24 pt-32 md:px-10">

      <div className="mx-auto grid max-w-[1400px] grid-cols-1 gap-16 lg:grid-cols-[1.3fr_1fr]">


        <div>

          <h1 className="mb-10 font-display text-4xl uppercase md:text-5xl">
            Finaliser la commande
          </h1>


          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >


            <div className="grid grid-cols-2 gap-4">

              <Field
                label="Prénom"
                required
                value={form.firstName}
                onChange={update("firstName")}
              />


              <Field
                label="Nom"
                required
                value={form.lastName}
                onChange={update("lastName")}
              />

            </div>


            <Field
              label="Numéro de téléphone"
              required
              type="tel"
              value={form.phone}
              onChange={update("phone")}
            />


            <Field
              label="Adresse"
              required
              value={form.address}
              onChange={update("address")}
            />
                        <div className="grid grid-cols-2 gap-4">

              <div>

                <label className="mb-2 block font-mono text-[11px] uppercase text-ash">
                  Wilaya *
                </label>


                <select
                  required
                  value={form.wilaya}
                  onChange={changeWilaya}
                  className="w-full border hairline bg-transparent px-4 py-3 text-sm"
                >

                  <option value="">
                    Choisir une wilaya
                  </option>


                  {ALGERIA_WILAYAS.map((w)=>(
                    <option
                      key={w}
                      value={w}
                    >
                      {w}
                    </option>
                  ))}

                </select>

              </div>



              <div>

                <label className="mb-2 block font-mono text-[11px] uppercase text-ash">
                  Commune *
                </label>


                <select
                  required
                  disabled={!form.wilaya}
                  value={form.commune}
                  onChange={update("commune")}
                  className="w-full border hairline bg-transparent px-4 py-3 text-sm disabled:opacity-40"
                >

                  <option value="">
                    Choisir une commune
                  </option>


                  {ALGERIA_COMMUNES[form.wilaya]?.map((c)=>(
                    <option
                      key={c}
                      value={c}
                    >
                      {c}
                    </option>
                  ))}


                </select>

              </div>

            </div>



            <Field
              label="Code postal (optionnel)"
              value={form.postalCode}
              onChange={update("postalCode")}
            />



            <div>

              <label className="mb-2 block font-mono text-[11px] uppercase text-ash">
                Mode de livraison
              </label>


              <div className="grid gap-3 sm:grid-cols-2">

                {[
                  {
                    value:"domicile",
                    label:"Livraison à domicile",
                    price:freeShipping ? 0 : settings.shippingDomicile
                  },
                  {
                    value:"bureau",
                    label:"Retrait au bureau",
                    price:freeShipping ? 0 : settings.shippingBureau
                  }

                ].map((opt)=>(
                  
                  <button
                    key={opt.value}
                    type="button"
                    onClick={()=>setDeliveryMethod(opt.value as DeliveryMethod)}
                    className={cn(
                      "border px-4 py-4 text-left",
                      deliveryMethod===opt.value
                      ? "border-signal text-signal"
                      : "hairline"
                    )}
                  >

                    <span className="font-mono text-xs uppercase">
                      {opt.label}
                    </span>


                    <span className="float-right font-mono text-xs">
                      {formatDZD(opt.price)}
                    </span>

                  </button>

                ))}

              </div>

            </div>



            <div>

              <label className="mb-2 block font-mono text-[11px] uppercase text-ash">
                Notes de commande (optionnel)
              </label>


              <textarea
                value={notes}
                onChange={(e)=>setNotes(e.target.value)}
                rows={3}
                placeholder="Instructions de livraison..."
                className="w-full border hairline bg-transparent px-4 py-3"
              />

            </div>



            {error && (

              <p className="border border-signal p-3 text-signal">
                {error}
              </p>

            )}



            <button
              disabled={submitting}
              className="bg-signal py-4 font-mono text-xs uppercase disabled:opacity-50"
            >

              {submitting
              ? "Traitement..."
              : "Passer la commande"}

            </button>


          </form>


        </div>





        <div className="border hairline p-6">


          <h2 className="mb-6 font-mono text-xs uppercase text-ash">
            Ta commande
          </h2>



          {lines.map((l)=>(

            <div
              key={`${l.productId}-${l.size}`}
              className="mb-4 flex gap-3"
            >


              <ProductImage
                url={l.image}
                alt={l.name}
                label={l.name}
                seed={l.slug}
                className="h-16 w-14"
              />


              <div className="flex-1">

                <p>
                  {l.name}
                </p>

                <p className="text-xs text-ash">
                  {l.size} × {l.quantity}
                </p>

              </div>


              <p className="font-mono text-xs">
                {formatDZD(l.price*l.quantity)}
              </p>


            </div>

          ))}



          <div className="border-t hairline pt-4">


            <div className="flex justify-between">
              <span>Sous-total</span>
              <span>{formatDZD(subtotal())}</span>
            </div>



            <div className="mt-2 flex justify-between">
              <span>Livraison</span>
              <span>{formatDZD(shippingEstimate)}</span>
            </div>



            <div className="mt-3 flex justify-between font-display text-xl uppercase">

              <span>Total</span>

              <span>
                {formatDZD(subtotal()+shippingEstimate)}
              </span>

            </div>


          </div>


        </div>


      </div>


    </div>
  );
}




function Field({
  label,
  required,
  type="text",
  value,
  onChange,
}:{
  label:string;
  required?:boolean;
  type?:string;
  value:string;
  onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void;
}){

  return (

    <div>

      <label className="mb-2 block font-mono text-[11px] uppercase text-ash">
        {label} {required && "*"}
      </label>


      <input
        required={required}
        type={type}
        value={value}
        onChange={onChange}
        className="w-full border hairline bg-transparent px-4 py-3"
      />

    </div>

  );

}