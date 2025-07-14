"use client";

import { Product as ProductType } from "@/typings/searchTypings";

type Props = {
  product: ProductType;
};

function Product({ product }: Props) {
  const { general, price, rating, seller } = product;

  return (
    <div className="border p-4 rounded-xl shadow-md hover:shadow-lg transition">
      <img
        src={general.image}
        alt={general.title}
        className="w-full h-48 object-contain mb-4"
      />
      <h3 className="font-semibold text-lg">{general.title}</h3>
      <p className="text-sm text-gray-600">{seller?.name}</p>
      <p className="mt-2 text-green-600 font-bold">${price.price}</p>
      <p className="text-yellow-500 text-sm">
        ⭐ {rating.rating} ({rating.count})
      </p>
    </div>
  );
}

export default Product;
