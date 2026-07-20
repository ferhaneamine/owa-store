/**
 * Seeds MongoDB with the starter O.W.A catalog (products + collections).
 * Run with: npm run seed
 * Requires MONGODB_URI in .env.local.
 */
import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product";
import Collection from "../models/Collection";
import { products, collections } from "../lib/mock-data";

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("Missing MONGODB_URI — add it to .env.local first.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  await Collection.deleteMany({});
  await Collection.insertMany(
    collections.map(({ _id, ...c }) => c)
  );
  console.log(`Seeded ${collections.length} collections`);

  await Product.deleteMany({});
  await Product.insertMany(
    products.map(({ _id, createdAt, updatedAt, ...p }) => p)
  );
  console.log(`Seeded ${products.length} products`);

  await mongoose.disconnect();
  console.log("Done.");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
