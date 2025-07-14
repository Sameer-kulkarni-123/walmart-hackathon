"use client";

import { Product as ProductType } from "@/typings/searchTypings";
import AddToCart from "@/components/AddToCart";
import { mapSearchProductToCartProduct } from "@/lib/mapSearchProductToCartProduct";
type Props = {
  product: ProductType;
};

function Product({ product }: Props) {
  const { general, price, rating, seller } = product;

  return (
    <div className="flex flex-col h-full border p-4 rounded-2xl shadow-md hover:shadow-lg transition bg-white">
      {/* Image */}
      <div className="w-full h-48 flex items-center justify-center mb-4">
        <img
          src={general.image}
          alt={general.title}
          className="max-h-full object-contain"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow justify-between">
        <div className="mb-2">
          <h3 className="font-semibold text-base line-clamp-2">
            {general.title}
          </h3>
          <p className="text-sm text-gray-500">{seller?.name}</p>
        </div>

        <div className="mt-auto space-y-2">
          <div>
            <p className="text-green-600 font-bold text-lg">
              ${price.price.toFixed(2)}
            </p>
            <p className="text-yellow-500 text-sm">
              ⭐ {rating.rating} ({rating.count})
            </p>
          </div>

          {/* Add to Cart Button */}
          <AddToCart product={mapSearchProductToCartProduct(product)} />
        </div>
      </div>
    </div>
  );
}

export default Product;
