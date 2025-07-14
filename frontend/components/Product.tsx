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
    <div className="flex flex-col h-full border p-4 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-200 bg-gradient-to-br from-white via-blue-50 to-blue-100">
      {/* Image */}
      <div className="w-full h-52 flex items-center justify-center mb-4 rounded-xl bg-gradient-to-t from-blue-100 to-white">
        <img
          src={general.image}
          alt={general.title}
          className="max-h-full object-contain drop-shadow-lg transition-transform duration-200 hover:scale-105"
        />
      </div>

      {/* Info */}
      <div className="flex flex-col flex-grow justify-between">
        <div className="mb-3">
          <h3 className="font-bold text-lg text-gray-800 line-clamp-2">
            {general.title}
          </h3>
          <p className="text-xs text-blue-700 font-medium">{seller?.name}</p>
        </div>

        <div className="mt-auto space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-green-600 font-extrabold text-xl">
              ${price.price.toFixed(2)}
            </p>
            <div className="flex items-center gap-1">
              <span className="text-yellow-400 text-lg">★</span>
              <span className="text-gray-700 font-semibold">{rating.rating}</span>
              <span className="text-gray-500 text-xs">({rating.count})</span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <AddToCart product={mapSearchProductToCartProduct(product)} />
        </div>
      </div>
    </div>
  );
}

export default Product;
