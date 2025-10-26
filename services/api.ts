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

export async function updateProductStock(id: number, newStock: number) {
  try {
    const res = await fetch(`${BASE_URL}/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock: newStock }),
    });
    if (!res.ok) throw new Error("Error updating stock");
    return await res.json();
  } catch (error) {
    console.error("UpdateProductStock error:", error);
  }
}