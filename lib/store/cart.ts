"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartLine } from "@/types";

interface CartState {
  lines: CartLine[];
  isOpen: boolean;
  couponCode: string | null;
  open: () => void;
  close: () => void;
  addLine: (line: CartLine) => void;
  removeLine: (productId: string, size: string) => void;
  setQuantity: (productId: string, size: string, quantity: number) => void;
  applyCoupon: (code: string) => void;
  clear: () => void;
  subtotal: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      couponCode: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      addLine: (line) =>
        set((state) => {
          const existing = state.lines.find(
            (l) => l.productId === line.productId && l.size === line.size
          );
          if (existing) {
            return {
              lines: state.lines.map((l) =>
                l === existing
                  ? { ...l, quantity: l.quantity + line.quantity }
                  : l
              ),
              isOpen: true,
            };
          }
          return { lines: [...state.lines, line], isOpen: true };
        }),
      removeLine: (productId, size) =>
        set((state) => ({
          lines: state.lines.filter(
            (l) => !(l.productId === productId && l.size === size)
          ),
        })),
      setQuantity: (productId, size, quantity) =>
        set((state) => ({
          lines: state.lines.map((l) =>
            l.productId === productId && l.size === size
              ? { ...l, quantity: Math.max(1, quantity) }
              : l
          ),
        })),
      applyCoupon: (code) => set({ couponCode: code }),
      clear: () => set({ lines: [], couponCode: null }),
      subtotal: () =>
        get().lines.reduce((sum, l) => sum + l.price * l.quantity, 0),
    }),
    { name: "owa-cart" }
  )
);
