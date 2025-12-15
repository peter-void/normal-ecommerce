"use server";

import { ActionResponse } from "@/types";
import { AddressSchema, AddressSchemaType } from "../schemas/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import prisma from "@/lib/prisma";

export async function addNewAddress(
  data: AddressSchemaType
): Promise<ActionResponse> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        message: "Unauthorized",
      };
    }

    const validatedData = AddressSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data",
      };
    }

    let { main_address, ...addressData } = validatedData.data;

    const addressCount = await prisma.address.count({
      where: { userId: session.user.id },
    });

    if (addressCount === 0) {
      main_address = true;
    }

    if (main_address && addressCount > 0) {
      await prisma.address.updateMany({
        where: { userId: session.user.id },
        data: { mainAddress: false },
      });
    }

    await prisma.address.create({
      data: {
        userId: session.user.id,
        mainAddress: main_address,
        provinceId: addressData.province_id,
        cityId: addressData.city_id,
        subdistrict: addressData.subdistrict,
        completeAddress: addressData.complete_address,
        receiverName: addressData.receiver_name,
        phoneNumber: addressData.phone_number,
        label: addressData.label,
        province: addressData.province,
        city: addressData.city,
        postalCode: addressData.postal_code,
        subdistrictId: addressData.subdistrict_id,
      },
    });

    return {
      success: true,
      message: "Address added successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to add new address",
    };
  }
}
