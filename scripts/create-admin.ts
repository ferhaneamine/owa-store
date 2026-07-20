/**
 * Creates (or updates) an admin account.
 *
 * Usage:
 *   npm run create-admin -- --email=you@brand.dz --password=yourpassword --name="Your Name"
 *
 * Or set ADMIN_EMAIL / ADMIN_PASSWORD / ADMIN_NAME in .env.local and run
 * without flags: npm run create-admin
 */
import "dotenv/config";
import mongoose from "mongoose";
import AdminUser from "../models/AdminUser";
import { hashPassword } from "../lib/auth";

function parseArgs() {
  const args = Object.fromEntries(
    process.argv.slice(2).map((arg) => {
      const [key, ...rest] = arg.replace(/^--/, "").split("=");
      return [key, rest.join("=")];
    })
  );
  return {
    email: args.email ?? process.env.ADMIN_EMAIL,
    password: args.password ?? process.env.ADMIN_PASSWORD,
    name: args.name ?? process.env.ADMIN_NAME ?? "Admin",
  };
}

async function run() {
  const { email, password, name } = parseArgs();
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error("Missing MONGODB_URI — add it to .env.local first.");
    process.exit(1);
  }
  if (!email || !password) {
    console.error(
      "Missing email/password. Pass --email=... --password=... or set ADMIN_EMAIL/ADMIN_PASSWORD in .env.local."
    );
    process.exit(1);
  }
  if (password.length < 8) {
    console.error("Password must be at least 8 characters.");
    process.exit(1);
  }

  await mongoose.connect(uri);
  console.log("Connected to MongoDB");

  const passwordHash = await hashPassword(password);
  const user = await AdminUser.findOneAndUpdate(
    { email: email.toLowerCase().trim() },
    { email: email.toLowerCase().trim(), passwordHash, name, role: "owner" },
    { upsert: true, new: true }
  );

  console.log(`Admin account ready: ${user.email}`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
