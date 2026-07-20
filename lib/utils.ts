import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDZD(amount: number) {
  return new Intl.NumberFormat("fr-DZ", { maximumFractionDigits: 0 }).format(
    amount
  ) + " DZD";
}
