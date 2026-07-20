import { connectDB } from "@/lib/db";
import ProductModel from "@/models/Product";
import CollectionModel from "@/models/Collection";
import { Product, Collection } from "@/types";
import {
  products as mockProducts,
  collections as mockCollections,
  getProductBySlug as getMockProductBySlug,
  getCollectionBySlug as getMockCollectionBySlug,
  getRelatedProducts as getMockRelatedProducts,
} from "@/lib/mock-data";

// Every function here checks whether MongoDB is actually connected first.
// If it's not (MONGODB_URI unset, or the connection fails), we transparently
// serve the mock catalog so the site still works as a demo. Once MongoDB is
// connected, these switch to fully live data — including correctly showing
// "not found" / empty states for real queries, rather than ever silently
// mixing in demo products once you're live.

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
  collectionSlug?: string;
  q?: string;
  sort?: string;
}): Promise<{ products: Product[]; live: boolean }> {
  const connected = await isDbConnected();

  if (!connected) {
    let list = [...mockProducts];
    if (filters?.category) list = list.filter((p) => p.category === filters.category);
    if (filters?.collectionSlug)
      list = list.filter((p) => p.collectionSlug === filters.collectionSlug);
    if (filters?.q) {
      const q = filters.q.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
      );
    }
    if (filters?.sort === "price_asc") list.sort((a, b) => a.price - b.price);
    if (filters?.sort === "price_desc") list.sort((a, b) => b.price - a.price);
    return { products: list, live: false };
  }

  const query: Record<string, unknown> = {};
  if (filters?.category) query.category = filters.category;
  if (filters?.collectionSlug) query.collectionSlug = filters.collectionSlug;
  if (filters?.q) query.$text = { $search: filters.q };

  const sortMap: Record<string, Record<string, 1 | -1>> = {
    newest: { createdAt: -1 },
    price_asc: { price: 1 },
    price_desc: { price: -1 },
  };

  const docs = await ProductModel.find(query)
    .sort(sortMap[filters?.sort ?? "newest"] ?? sortMap.newest)
    .lean();

  return { products: serialize<Product[]>(docs), live: true };
}

export async function getProductBySlug(
  slug: string
): Promise<{ product: Product | null; live: boolean }> {
  const connected = await isDbConnected();
  if (!connected) {
    return { product: getMockProductBySlug(slug) ?? null, live: false };
  }
  const doc = await ProductModel.findOne({ slug }).lean();
  return { product: doc ? serialize<Product>(doc) : null, live: true };
}

export async function getRelatedProducts(
  product: Product,
  live: boolean,
  limit = 4
): Promise<Product[]> {
  if (!live) return getMockRelatedProducts(product, limit);
  const docs = await ProductModel.find({
    _id: { $ne: product._id },
    $or: [
      { collectionSlug: product.collectionSlug },
      { category: product.category },
    ],
  })
    .limit(limit)
    .lean();
  return serialize<Product[]>(docs);
}

export async function getCollections(): Promise<{ collections: Collection[]; live: boolean }> {
  const connected = await isDbConnected();
  if (!connected) return { collections: mockCollections, live: false };
  const docs = await CollectionModel.find().sort({ order: 1 }).lean();
  return { collections: serialize<Collection[]>(docs), live: true };
}

export async function getCollectionBySlug(
  slug: string
): Promise<{ collection: Collection | null; live: boolean }> {
  const connected = await isDbConnected();
  if (!connected) {
    return { collection: getMockCollectionBySlug(slug) ?? null, live: false };
  }
  const doc = await CollectionModel.findOne({ slug }).lean();
  return { collection: doc ? serialize<Collection>(doc) : null, live: true };
}
