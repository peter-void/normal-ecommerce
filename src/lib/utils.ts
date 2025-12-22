import { clsx, type ClassValue } from "clsx";
import slugify from "slugify";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cleanSlug(slug: string) {
  return slugify(slug, {
    lower: true,
    strict: true,
    trim: true,
  });
}

export function parseNumberInput(input: string): number | undefined {
  if (input.trim() === "") return undefined;

  const normalized = input.replace(",", ".");

  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) return;

  return parsed;
}

export function serializeProduct(product: any) {
  return {
    ...product,
    price: product.price.toString(),
    weight: product.weight?.toString() ?? null,
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
  };
}

export function generateDate() {
  const date = [];

  for (let i = 1; i <= 31; i++) {
    date.push(i.toString());
  }

  return date;
}

export function generateYear() {
  const minYear = 1945;
  const maxYear = 2011;

  const years = [];

  for (let i = minYear; i <= maxYear; i++) {
    years.push(i.toString());
  }

  return years;
}

export function generatePublicImageURL(key: string) {
  return `https://uploader.t3.storage.dev/${key}`;
}
