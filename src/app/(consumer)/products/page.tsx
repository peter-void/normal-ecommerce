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
  weight?: string;
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
    <div className="min-h-screen bg-neutral-100 relative font-sans pt-20">
      <div className="absolute inset-0 bg-[radial-gradient(#000_1px,transparent_1px)] bg-size-[20px_20px] opacity-5 pointer-events-none" />

      <div className="bg-cyan-400 border-y-4 border-black py-16 px-4 md:px-8 relative overflow-hidden">
        <div className="absolute top-4 right-10 w-24 h-24 bg-yellow-400 rounded-full border-4 border-black hidden md:block" />
        <div className="absolute bottom-4 left-20 w-16 h-16 bg-pink-500 rotate-12 border-4 border-black hidden md:block" />

        <div className="container mx-auto relative z-10 text-center md:text-left">
          <span className="inline-block bg-black text-white px-3 py-1 font-bold text-xs uppercase mb-4 tracking-widest">
            Shop Collection {new Date().getFullYear()}
          </span>
          <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter leading-none mb-4 italic">
            All <span className="text-white text-stroke-black">Products</span>
          </h1>
          <p className="font-bold text-lg md:text-xl max-w-xl leading-relaxed">
            Bold designs. Zero compromises. Find your statement piece in our
            curated collection of neo-brutalist essentials.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 relative z-10">
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
