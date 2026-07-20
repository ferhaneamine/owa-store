import { Product, Collection } from "@/types";

export const collections: Collection[] = [
  {
    _id: "c1",
    slug: "front-de-mer",
    name: "Front de Mer",
    tagline: "Coupes amples, finitions premium",
    description:
      "Hoodies et t-shirts en coton épais, coupe oversize, imprimés graphiques en édition limitée.",
    coverImage: {
      url: "",
      publicId: "",
      alt: "Front de Mer",
    },
    order: 1,
  },
  {
    _id: "c2",
    slug: "corniche",
    name: "Corniche",
    tagline: "Pièces techniques, tons minéraux",
    description:
      "Cargos et vestes techniques pensés pour un usage quotidien, tissus déperlants et coupes structurées.",
    coverImage: { url: "", publicId: "", alt: "Corniche" },
    order: 2,
  },
  {
    _id: "c3",
    slug: "medina",
    name: "Médina",
    tagline: "Basiques essentiels",
    description:
      "Hoodies et t-shirts unis, coupe droite, matières douces — les indispensables du vestiaire.",
    coverImage: { url: "", publicId: "", alt: "Médina" },
    order: 3,
  },
  {
    _id: "c4",
    slug: "31",
    name: "31",
    tagline: "Collection capsule",
    description:
      "Une capsule graphique en édition limitée, floquée et brodée, disponible en quantités restreintes.",
    coverImage: { url: "", publicId: "", alt: "31" },
    order: 4,
  },
];

export const products: Product[] = [
  {
    _id: "p1",
    slug: "owa-signature-hoodie",
    name: "OWA Signature Hoodie",
    price: 6900,
    description:
      "Le hoodie fondateur de la marque. Coton épais 400gsm, coupe oversize, logo brodé au dos.",
    category: "hoodie",
    collectionSlug: "front-de-mer",
    colors: ["Noir"],
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 14 },
      { size: "L", stock: 12 },
      { size: "XL", stock: 6 },
      { size: "XXL", stock: 3 },
    ],
    images: [{ url: "", publicId: "", alt: "OWA Signature Hoodie" }],
    featured: true,
    isNewArrival: true,
    tags: ["hoodie", "signature", "bestseller"],
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    _id: "p2",
    slug: "front-de-mer-tee",
    name: "Front de Mer Tee",
    price: 3500,
    description:
      "T-shirt en coton peigné avec impression graphique. Coupe régulière, édition limitée.",
    category: "tshirt",
    collectionSlug: "front-de-mer",
    colors: ["Noir"],
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 18 },
      { size: "L", stock: 15 },
      { size: "XL", stock: 7 },
    ],
    images: [{ url: "", publicId: "", alt: "Front de Mer Tee" }],
    featured: true,
    isNewArrival: true,
    tags: ["tshirt", "graphic"],
    createdAt: "2026-06-01",
    updatedAt: "2026-06-01",
  },
  {
    _id: "p3",
    slug: "oranais-hoodie",
    name: "Signature Hoodie Écru",
    price: 6900,
    description:
      "Hoodie crème avec typographie O.W.A brodée sur la poitrine. Coupe droite, poche kangourou renforcée.",
    category: "hoodie",
    collectionSlug: "medina",
    colors: ["Écru"],
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 11 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 4 },
    ],
    images: [{ url: "", publicId: "", alt: "Oranais Hoodie" }],
    featured: true,
    isNewArrival: false,
    tags: ["hoodie"],
    createdAt: "2026-05-15",
    updatedAt: "2026-05-15",
  },
  {
    _id: "p4",
    slug: "code-31-tee",
    name: "Code 31 Tee",
    price: 3500,
    description:
      "Le numéro 31 en grand floqué au dos, façon maillot sportif. Coton lourd, coupe droite.",
    category: "tshirt",
    collectionSlug: "31",
    colors: ["Noir"],
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 20 },
      { size: "L", stock: 16 },
      { size: "XL", stock: 8 },
    ],
    images: [{ url: "", publicId: "", alt: "Code 31 Tee" }],
    featured: true,
    isNewArrival: true,
    tags: ["tshirt", "football"],
    createdAt: "2026-06-10",
    updatedAt: "2026-06-10",
  },
  {
    _id: "p5",
    slug: "tech-cargo-pant",
    name: "Tech Cargo Pant",
    price: 8200,
    description:
      "Pantalon cargo technique, poches multiples, cordon de serrage à la cheville. Tissu déperlant, coupe droite.",
    category: "pants",
    collectionSlug: "corniche",
    colors: ["Noir", "Kaki"],
    sizes: [
      { size: "S", stock: 6 },
      { size: "M", stock: 10 },
      { size: "L", stock: 9 },
      { size: "XL", stock: 5 },
    ],
    images: [{ url: "", publicId: "", alt: "Tech Cargo Pant" }],
    featured: false,
    isNewArrival: false,
    tags: ["pants", "cargo"],
    createdAt: "2026-04-20",
    updatedAt: "2026-04-20",
  },
  {
    _id: "p6",
    slug: "sunset-collection-cap",
    name: "Sunset Collection Cap",
    price: 2800,
    description:
      "Casquette 6 panneaux avec logo O.W.A brodé. Ajustable, dégradé cousu bicolore.",
    category: "accessory",
    collectionSlug: "front-de-mer",
    colors: ["Noir"],
    sizes: [{ size: "Unique", stock: 22 }],
    images: [{ url: "", publicId: "", alt: "Sunset Collection Cap" }],
    featured: false,
    isNewArrival: true,
    tags: ["accessory", "cap"],
    createdAt: "2026-06-12",
    updatedAt: "2026-06-12",
  },
];

export function getProductBySlug(slug: string) {
  return products.find((p) => p.slug === slug);
}

export function getCollectionBySlug(slug: string) {
  return collections.find((c) => c.slug === slug);
}

export function getRelatedProducts(product: Product, limit = 4) {
  return products
    .filter(
      (p) =>
        p._id !== product._id &&
        (p.collectionSlug === product.collectionSlug ||
          p.category === product.category)
    )
    .slice(0, limit);
}
