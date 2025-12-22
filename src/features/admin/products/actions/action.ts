"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types";
import { CreateProductSchema, createProductSchema } from "../schemas/schema";
import { revalidatePath } from "next/cache";

export async function deleteProduct(pId: string): Promise<ActionResponse> {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: pId,
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    await prisma.product.delete({
      where: {
        id: pId,
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product deleted successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to delete product",
    };
  }
}

export async function updateProduct(
  data: CreateProductSchema,
  pId: string
): Promise<ActionResponse> {
  try {
    const validatedData = createProductSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data",
      };
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: pId,
      },
    });

    if (!existingProduct) {
      return {
        success: false,
        message: "Product not found",
      };
    }

    const {
      categoryId,
      description,
      image,
      name,
      price,
      slug,
      stock,
      isActive,
      weight,
    } = validatedData.data;

    await prisma.product.update({
      where: {
        id: pId,
      },
      data: {
        name,
        slug,
        price,
        stock,
        isActive,
        weight,
        description,
        categoryId,
        images: {
          connect: image.map((url) => ({ id: url.id, key: url.key })),
        },
      },
    });

    return {
      success: true,
      message: "Product updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update product",
    };
  }
}

export async function createProduct(
  data: CreateProductSchema
): Promise<ActionResponse> {
  try {
    const validatedData = createProductSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Invalid data",
      };
    }

    const {
      categoryId,
      description,
      image,
      name,
      price,
      slug,
      stock,
      isActive,
      weight,
      isFeatured,
    } = validatedData.data;

    await prisma.product.create({
      data: {
        name,
        slug,
        price,
        stock,
        isActive,
        isFeatured,
        weight,
        description,
        categoryId,
        images: {
          connect: image.map((url) => ({ id: url.id, key: url.key })),
        },
      },
    });

    revalidatePath("/admin/products");

    return {
      success: true,
      message: "Product created successfully",
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
      message: "Failed to create product",
    };
  }
}
