"use client";

import React, { useMemo } from "react";
import { useCartStore } from "@/store";
import { Product } from "@/typings/productTypings";
import { Button } from "./ui/button";
import RemoveFromCart from "./RemoveFromCart";

type Props = {
  product: Product;
};

function AddToCart({ product }: Props) {
  const [cart, addToCart] = useCartStore((state) => [
    state.cart,
    state.addToCart,
  ]);

  // Guard against products missing SKU
  const productSku = product.meta?.sku;
  if (!productSku) {
    return null; // or show a disabled button
  }

  // Count how many of this product are in the cart
  const howManyInCart = useMemo(() => {
    return cart.filter((item) => item.meta?.sku === productSku).length;
  }, [cart, productSku]);

  const handleAdd = () => {
    console.log("Adding to cart:", product);
    addToCart(product);
  };

  return howManyInCart > 0 ? (
    <div className="flex items-center space-x-4">
      <RemoveFromCart product={product} />
      <span className="text-sm font-medium">{howManyInCart}</span>
      <Button
        onClick={handleAdd}
        className="bg-walmart hover:bg-walmart/80 transition"
        aria-label="Add one more to cart"
      >
        +
      </Button>
    </div>
  ) : (
    <Button
      onClick={handleAdd}
      className="bg-walmart hover:bg-walmart/80 transition w-full"
      aria-label="Add to cart"
    >
      Add to Cart
    </Button>
  );
}

export default AddToCart;
