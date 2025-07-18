"use client";
import { getCartTotal } from "@/lib/getCartTotal";
import { groupBySKU } from "@/lib/groupBySKU";
import { useCartStore } from "@/store";
import Image from "next/image";
import React, { useState } from "react";
import AddToCart from "./AddToCart";
import { Button } from "./ui/button";
import { Product } from "@/typings/productTypings";
import HowToUseSidebar from "./HowToUseSidebar";
import AllergyCheckButton from "./AllergyCheckButton";

function Basket() {
  const cart = useCartStore((state) => state.cart);
  const grouped = groupBySKU(cart);
  const basketTotal = getCartTotal(cart);
  const [howToUseOpen, setHowToUseOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <div className="max-w-7xl mx-auto px-4">
      <ul className="space-y-5 divide-y">
        {Object.keys(grouped).map((sku) => {
          const item = grouped[sku][0];
          const total = getCartTotal(grouped[sku]);
          return (
            <li
              key={sku}
              className="py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              <div className="flex items-center gap-4">
                {item.images[0] && (
                  <Image
                    src={item.images[0]}
                    alt={item.title}
                    width={80}
                    height={80}
                    className="rounded-md object-cover"
                  />
                )}
                <div>
                  <p className="line-clamp-2 font-bold">{item.title}</p>
                  <AllergyCheckButton productTitle={item.title} productDescription={item.description} />
                  <div
                    dangerouslySetInnerHTML={{ __html: item.description }}
                    className="line-clamp-1 font-light text-sm mt-2"
                  />
                </div>
              </div>
              <div className="flex flex-row md:flex-col items-center md:items-end gap-4 md:border md:rounded-md md:p-5">
                <AddToCart product={item} />
                <p className="font-bold text-right text-lg md:mt-4">
                  {total}
                </p>
                <Button
                  variant="outline"
                  className="mt-2 border-walmart text-walmart hover:bg-walmart/10"
                  onClick={() => {
                    setSelectedProduct(item as Product);
                    setHowToUseOpen(true);
                  }}
                >
                  How to Use?
                </Button>
              </div>
            </li>
          );
        })}
      </ul>

      <div className="flex flex-col items-end p-5">
        <p className="font-bold text-2xl text-walmart mb-5">
          Total: {basketTotal}
        </p>
        <Button className="w-full md:w-64 h-14 bg-walmart hover:bg-walmart/80 text-lg">
          Checkout
        </Button>
      </div>
      <HowToUseSidebar
        isOpen={howToUseOpen}
        onClose={() => setHowToUseOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
}

export default Basket;
