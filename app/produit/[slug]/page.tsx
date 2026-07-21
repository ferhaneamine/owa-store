import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ProductDetail from "@/components/product/ProductDetail";
import { formatDZD } from "@/lib/utils";
import { getProductBySlug, getRelatedProducts } from "@/lib/data";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const { product } = await getProductBySlug(slug);

  if (!product) return { title: "Produit introuvable" };

  return {
    title: product.name,
    description: `${product.name} — ${formatDZD(product.price)}. ${product.description}`,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { product, live } = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRelatedProducts(product, live);

  // Hide real stock quantities from customers
  const publicProduct = {
    ...product,
    sizes: product.sizes.map((s) => ({
      size: s.size,
      stock: s.stock > 0 ? 1 : 0,
    })),
  };

  return (
    <ProductDetail
      product={publicProduct}
      related={related}
    />
  );
}