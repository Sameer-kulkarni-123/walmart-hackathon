"use client";

import React from "react";
import { Product } from "@/typings/productTypings";
import { useCartStore } from "@/store";
import { Button } from "./ui/button";

type Props = {
  product: Product;
};

function RemoveFromCart({ product }: Props) {
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const handleRemove = () => {
    if (!product.meta?.sku) {
      console.warn("Attempted to remove product without SKU:", product);
      return;
    }

    removeFromCart(product);
  };

  return (
    <Button
      onClick={handleRemove}
      className="bg-walmart hover:bg-walmart/50 transition"
      aria-label="Remove from cart"
    >
      −
    </Button>
  );
}

export default RemoveFromCart;
