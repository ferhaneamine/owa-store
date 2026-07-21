/**
 * Seeds MongoDB with the starter O.W.A catalog (products only).
 * Run with: npm run seed
 * Requires MONGODB_URI in .env.local.
 */

import "dotenv/config";
import mongoose from "mongoose";
import Product from "../models/Product";
import { products } from "../lib/mock-data";

async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Missing MONGODB_URI — add it to .env.local first.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

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