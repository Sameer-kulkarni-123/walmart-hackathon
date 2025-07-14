import { Product as SearchProduct } from "@/typings/searchTypings";
import { Product as CartProduct } from "@/typings/productTypings";

export function mapSearchProductToCartProduct(searchProduct: SearchProduct): CartProduct {
  const { general, price, rating, seller, variants } = searchProduct;

  return {
    url: `https://www.walmart.com${general.url}`,
    meta: {
      sku: general.product_id, // using product_id as SKU
      gtin: "", // not available in search
    },
    price: price.price,
    title: general.title,
    images: [general.image],
    rating: {
      count: rating.count,
      rating: rating.rating,
    },
    seller: {
      id: "",
      url: "",
      name: seller?.name || "",
      catalog_id: "",
      official_name: "",
    },
    currency: price.currency,
    warranty: "",
    _warnings: [],
    variations: variants?.map((v) => ({
      state: "",
      product_id: v.product_id,
      selected_options: [],
    })) || [],
    breadcrumbs: [],
    description: "",
    out_of_stock: general?.out_of_stock ?? false,
    specifications: [],
    parse_status_code: 0,
  };
}
