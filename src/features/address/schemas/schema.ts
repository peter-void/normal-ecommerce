import { z } from "zod";

export const AddressSchema = z.object({
  receiver_name: z
    .string()
    .min(3, { error: "Name must be at least 3 characters long" }),
  phone_number: z
    .string()
    .min(12, { error: "Phone number must be at least 12 characters long" }),
  postal_code: z
    .string()
    .min(5, { error: "Postal code must be at least 5 characters long" }),
  label: z
    .string()
    .min(1, { error: "Label must be at least 1 character long" }),
  province: z
    .string()
    .min(1, { error: "Province must be at least 1 character long" }),
  province_id: z
    .string()
    .min(1, { error: "Province ID must be at least 1 character long" }),
  city: z.string().min(1, { error: "City must be at least 1 character long" }),
  city_id: z
    .string()
    .min(1, { error: "City ID must be at least 1 character long" }),
  subdistrict: z
    .string()
    .min(1, { error: "Subdistrict must be at least 1 character long" }),
  subdistrict_id: z
    .string()
    .min(1, { error: "Subdistrict ID must be at least 1 character long" }),
  complete_address: z
    .string()
    .min(1, { error: "Complete address must be at least 1 character long" }),
  main_address: z.boolean().optional(),
});

export type AddressSchemaType = z.infer<typeof AddressSchema>;
