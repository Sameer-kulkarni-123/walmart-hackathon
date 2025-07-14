import { Product } from "@/typings/productTypings";

export function groupBySKU(products: Product[]): Record<string, Product[]> {
  return products?.reduce(
    (accumulator: Record<string, Product[]>, currentProduct: Product) => {
      const sku = currentProduct.meta?.sku;

      if (!sku) {
        console.warn("Skipping product with missing SKU:", currentProduct);
        return accumulator;
      }

      if (!accumulator[sku]) {
        accumulator[sku] = [];
      }

      accumulator[sku].push(currentProduct);
      return accumulator;
    },
    {}
  );
}
