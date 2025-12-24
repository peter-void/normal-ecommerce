"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types";
import {
  createCategorySchema,
  deleteCategorySchema,
  updateCategorySchema,
} from "../schemas/schema";
import { revalidatePath } from "next/cache";
import z from "zod";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { S3 } from "@/lib/s3-client";

export async function updateCategory({
  data,
  cId,
}: {
  data: z.infer<typeof updateCategorySchema>;
  cId: string;
}): Promise<ActionResponse> {
  const validatedData = updateCategorySchema.safeParse(data);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid Data",
    };
  }

  const { name, slug, description, image, isActive } = validatedData.data;

  const existingCategory = await prisma.category.findUnique({
    where: { id: cId },
    include: {
      image: {
        select: {
          id: true,
          key: true,
        },
      },
    },
  });

  if (!existingCategory) {
    return {
      success: false,
      message: "Category not found",
    };
  }

  if (existingCategory.imageId && !image) {
    await prisma.category.update({
      where: { id: cId },
      data: {
        image: {
          disconnect: true,
        },
      },
    });
  }

  await prisma.category.update({
    where: { id: cId },
    data: {
      name,
      slug,
      description: description || null,
      ...(image && {
        image: {
          connect: {
            id: image,
          },
        },
      }),
      isActive,
    },
  });

  revalidatePath("/admin/categories");

  return {
    success: true,
    message: "Category updated successfully",
  };
}

export async function deleteCategory({
  id,
}: {
  id: string;
}): Promise<ActionResponse> {
  const validatedData = deleteCategorySchema.safeParse({ id });

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid Data",
    };
  }

  const existingCategory = await prisma.category.findUnique({
    where: { id },
    include: {
      image: {
        select: {
          id: true,
          key: true,
        },
      },
    },
  });

  if (!existingCategory) {
    return {
      success: false,
      message: "Category not found",
    };
  }

  if (existingCategory.image) {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: existingCategory.image.key,
    });

    await S3.send(command);
  }

  await prisma.category.delete({
    where: { id },
  });

  revalidatePath("/admin/categories");

  return {
    success: true,
    message: "Category deleted successfully",
  };
}

export async function createCategory(
  props: z.infer<typeof createCategorySchema>
): Promise<ActionResponse> {
  const validatedData = createCategorySchema.safeParse(props);

  if (!validatedData.success) {
    return {
      success: false,
      message: "Invalid data",
    };
  }

  const { name, slug, description, image, isActive } = validatedData.data;

  const existingCategory = await prisma.category.findUnique({
    where: {
      slug,
    },
  });

  if (existingCategory) {
    return {
      success: false,
      message: "Category already exists",
    };
  }

  await prisma.category.create({
    data: {
      name,
      slug,
      description: description || null,
      ...(image && {
        image: {
          connect: {
            id: image,
          },
        },
      }),
      isActive,
    },
  });

  revalidatePath("/admin/categories");

  return {
    success: true,
    message: "Category created successfully",
  };
}
