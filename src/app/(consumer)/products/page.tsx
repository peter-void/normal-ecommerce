import { getAllProducts } from "@/dal/get-all-products";
import { ProductListing } from "@/features/products/components/product-listing";
import { Prisma } from "@/generated/prisma/client";
import { PageProps, ProductDecimalColumn } from "@/types";

export type GetAllProductsProps = Omit<
  Prisma.ProductGetPayload<{
    include: {
      images: true;
      category: true;
    };
  }>,
  ProductDecimalColumn
> & {
  price?: string;
  weight?: string | null;
  createdAt?: string;
  updatedAt?: string;
};

export default async function Page(props: PageProps) {
  const sortOption = (await props.searchParams)?.sort as string;
  const q = (await props.searchParams)?.q as string;

  const {
    items: productsData,
    nextCursor,
    hasMore,
  } = await getAllProducts(undefined, sortOption, q);

  return (
    <div className="min-h-screen bg-white text-black font-sans pt-[72px]">
      {/* Page Header */}
      <div className="border-b border-gray-200 py-12 px-4 md:px-8">
        <div className="container mx-auto">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-2">
            ✦ COMPLETE CATALOG
          </p>
          <h1
            className="font-black uppercase tracking-tight leading-[0.9] text-black"
            style={{ fontSize: "clamp(36px, 6vw, 80px)" }}
          >
            ALL PRODUCTS
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-10">
        <ProductListing
          initialProducts={productsData}
          initialHasMore={hasMore}
          initialCursor={nextCursor}
          initialQ={q}
        />
      </div>
    </div>
  );
}
