import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string().min(3, { error: "Name must be at least 3 characters long" }),
  description: z
    .string()
    .optional()
    .nullable()
    .transform((value) => value || null),
  stock: z.number().int().min(1, { error: "Stock must be at least 1" }),
  image: z.array(
    z.object({
      id: z.string(),
      key: z.string(),
    })
  ),
  isActive: z.boolean().optional(),
  categoryId: z.string().min(1, { error: "Category ID is required" }),
  slug: z.string().min(1, { error: "Slug is required" }),
  weight: z
    .number()
    .optional()
    .nullable()
    .transform((value) => value || null),
  price: z.number().min(1, { error: "Price is required" }),
  isFeatured: z.boolean().optional(),
});

export type CreateProductSchema = z.infer<typeof createProductSchema>;
