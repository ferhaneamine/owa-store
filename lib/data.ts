import { connectDB } from "@/lib/db";
import ProductModel from "@/models/Product";
import { Product } from "@/types";
import {
  products as mockProducts,
  getProductBySlug as getMockProductBySlug,
  getRelatedProducts as getMockRelatedProducts,
} from "@/lib/mock-data";

function serialize<T>(doc: unknown): T {
  return JSON.parse(JSON.stringify(doc));
}

async function isDbConnected(): Promise<boolean> {
  try {
    await connectDB();
    return true;
  } catch {
    return false;
  }
}

export async function getProducts(filters?: {
  category?: string;
  q?: string;
  sort?: string;
}): Promise<{ products: Product[]; live: boolean }> {
  const connected = await isDbConnected();

  if (!connected) {
    let list = [...mockProducts];

    if (filters?.category) {
      list = list.filter((p) => p.category === filters.category);
    }

    if (filters?.q) {
      const q = filters.q.toLowerCase();

      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    if (filters?.sort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    }

    if (filters?.sort === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return { products: list, live: false };
  }

  const query: Record<string, unknown> = {};

  if (filters?.category) {
    query.category = filters.category;
  }

  if (filters?.q) {
    query.$text = { $search: filters.q };
  }

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };

  const docs = await ProductModel.find(query)
    .sort(sortMap[filters?.sort ?? "newest"] ?? sortMap.newest)
    .lean();

  return {
    products: serialize<Product[]>(docs),
    live: true,
  };
}

export async function getProductBySlug(
  slug: string
): Promise<{ product: Product | null; live: boolean }> {
  const connected = await isDbConnected();

  if (!connected) {
    return {
      product: getMockProductBySlug(slug) ?? null,
      live: false,
    };
  }

  const doc = await ProductModel.findOne({ slug }).lean();

  return {
    product: doc ? serialize<Product>(doc) : null,
    live: true,
  };
}

export async function getRelatedProducts(
  product: Product,
  live: boolean,
  limit = 4
): Promise<Product[]> {
  if (!live) {
    return getMockRelatedProducts(product, limit);
  }

  const docs = await ProductModel.find({
    _id: { $ne: product._id },
    category: product.category,
  })
    .limit(limit)
    .lean();

  return serialize<Product[]>(docs);
}