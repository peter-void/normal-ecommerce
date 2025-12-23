"use server";

import { getAllProducts } from "@/dal/get-all-products";

export async function getAllProductsAction(
  cursor?: string,
  sort?: string,
  q?: string
) {
  return getAllProducts(cursor, sort, q);
}
