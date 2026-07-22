// ---------------------------------------------------------------------------
// O.W.A domain types — mirrors the MongoDB schemas in /models so the frontend
// and API stay in sync without duplicating shape definitions.
// ---------------------------------------------------------------------------

export type Wilaya =
  | "Oran" | "Alger" | "Constantine" | "Annaba" | "Blida" | "Sétif"
  | "Tlemcen" | "Béjaïa" | "Mostaganem" | "Sidi Bel Abbès" | "Autre";

export type DeliveryMethod = "domicile" | "bureau";

export type OrderStatus =
  | "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface ProductImage {
  url: string;
  publicId: string; // Cloudinary public_id, needed for deletion/replacement
  alt: string;
}

export interface ProductVariantStock {
  size: string; // e.g. "S" | "M" | "L" | "XL" | "XXL"
  stock: number;
}

export interface Product {
  _id: string;
  slug: string;
  name: string;
  price: number; // DZD
  compareAtPrice?: number;
  description: string;
  category: "hoodie" | "tshirt" | "pants" | "accessory";
  categorySlug: string;
  colors: string[];
  sizes: ProductVariantStock[];
  images: ProductImage[];
  featured: boolean;
  isNewArrival: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  _id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  coverImage: ProductImage;
  order: number;
}

export interface CartLine {
  productId: string;
  slug: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export interface CustomerInfo {
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  commune: string;
  wilaya: Wilaya;
  postalCode?: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export interface SiteSettings {
  shippingDomicile: number;
  shippingBureau: number;
  freeShippingThreshold: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  deliveryMethod: DeliveryMethod;
  notes?: string;
  subtotal: number;
  shippingEstimate: number;
  total: number;
  status: OrderStatus;
  paymentMethod: "cod"; // architecture allows adding "card" | "edahabia" later
  createdAt: string;
}
