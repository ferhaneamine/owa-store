import Hero from "@/components/home/Hero";
import LatestDrop from "@/components/home/LatestDrop";
import ShopByCategory from "@/components/home/ShopByCategory";
import BestSellers from "@/components/home/BestSellers";
import Newsletter from "@/components/home/Newsletter";
import { getProducts } from "@/lib/data";

export default async function HomePage() {
  const { products } = await getProducts();

  return (
    <>
      <Hero />

      {/* <LatestDrop products={products} /> */}

      {/* <ShopByCategory /> */}

      {/* <BestSellers products={products} /> */}

      {/* <Newsletter /> */}
    </>
  );
}