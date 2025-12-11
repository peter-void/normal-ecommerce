import { Category, Image, Prisma } from "./generated/prisma/client";

export type ActionResponse = {
  success: boolean;
  message: string;
  data?: string;
};

export type PageProps = {
  params: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
};

export type ProductDecimalType = {
  price: string;
  weight: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductDecimalColumn =
  | "price"
  | "weight"
  | "createdAt"
  | "updatedAt";

export type SerializedProduct = Omit<
  Prisma.ProductGetPayload<{
    include: {
      category: {
        select: {
          name: true;
        };
      };
      images: {
        select: {
          alt: true;
          src: true;
        };
        take: 1;
      };
    };
  }>,
  ProductDecimalColumn
> &
  ProductDecimalType;

export interface ProductTableProps {
  products: SerializedProduct[];
  skip: number;
}

export interface ProductEditProps {
  product: Omit<SerializedProduct, "images" | "category"> & {
    images: Image[];
    category: Category;
  };
}

export type CartItemType = {
  product: Omit<
    Prisma.ProductGetPayload<{ include: { images: true } }>,
    ProductDecimalColumn
  > &
    ProductDecimalType;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  productId: string;
  quantity: number;
  cartId: string;
};

// Base properties shared by both upload file types
export type BaseUploadFile = {
  id: string;
  imageId?: string;
  key?: string;
  publicImageURL?: string;
  objectUrl?: string;
  isDeleting?: boolean;
  error?: boolean;
  progress?: number;
  isUploading?: boolean;
};

export type UserAuth = {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  email: string;
  emailVerified: boolean;
  name: string;
  image?: string | null | undefined;
  isAdmin: boolean;
  gender?: string | null | undefined;
  dateOfBirth?: Date | null | undefined;
  phoneNumber?: string | null | undefined;
};
