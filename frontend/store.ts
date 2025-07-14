import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { Product } from "./typings/productTypings";

interface CartState {
  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (product: Product) => void;
}

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        cart: [],

        addToCart: (product) => {
          const skuToAdd = product.meta?.sku;

          if (!skuToAdd) {
            console.warn("Cannot add product — SKU is missing:", product);
            return;
          }

          set((state) => ({
            cart: [...state.cart, product],
          }));
        },

        removeFromCart: (product) => {
          const skuToRemove = product.meta?.sku;

          if (!skuToRemove) {
            console.warn("Cannot remove product — SKU is missing:", product);
            return;
          }

          set((state) => {
            const index = state.cart.findIndex(
              (p) => p.meta?.sku === skuToRemove
            );

            if (index === -1) {
              console.warn("Product not found in cart:", product);
              return state;
            }

            const newCart = [...state.cart];
            newCart.splice(index, 1);

            return { cart: newCart };
          });
        },
      }),
      {
        name: "shopping-cart-storage", // localStorage key
      }
    )
  )
);
