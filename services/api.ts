// services/api.ts
export type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  stock: number;
  category: string;
};

const BASE_URL = "https://my-json-server.typicode.com/bsibecas/products-api";

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${BASE_URL}/products`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}
