import { ProductContent } from "@/typings/productTypings";

async function fetchProduct(productId: string) {
  const username = process.env.OXYLABS_USERNAME;
  const password = process.env.OXYLABS_PASSWORD;

  const body = {
    source: "walmart_product",
    parse: true,
    product_id: productId,
  };

  try {
    const res = await fetch("https://realtime.oxylabs.io/v1/queries", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
        Authorization:
          "Basic " + Buffer.from(`${username}:${password}`).toString("base64"),
      },
      next: {
        revalidate: 60 * 60 * 24 * 365, // 1 year cache
      },
    });

    const data = await res.json();

    if (!data?.results?.length) return;

    const result: ProductContent = data.results[0];
    return result.content;
  } catch (err) {
    console.error("Failed to fetch product:", err);
    return null;
  }
}

export default fetchProduct;
