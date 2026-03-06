import { getPublicCategoryBySlug } from "@/dal/getCategories";
import { CategoryProductContent } from "@/features/categories/components/category-product-content";
import { PageProps, ProductWithAvailability } from "@/types";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import Link from "next/link";

export default async function Page({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const qSearchParams = await searchParams;

  if (!slug || typeof slug !== "string") {
    notFound();
  }

  const category = await getPublicCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const productCount = await prisma.product.count({
    where: { categoryId: category.id, isActive: true },
  });

  return (
    <div className="min-h-screen bg-white text-black relative font-sans pt-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-6 flex items-center gap-2 text-sm">
          <Link href="/" className="hover:underline flex items-center gap-2">
            <span>&larr;</span> Kembali
          </Link>
          <span> Beranda / </span>
          <span className="uppercase">{category.name}</span>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-6 mb-8 pb-4">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight mb-4">
              {category.name}{" "}
              <span className="text-lg font-normal text-gray-500 tracking-normal">
                [{productCount}]
              </span>
            </h1>
            <p className="text-base text-gray-700 leading-relaxed">
              Explore our selection of {category.name}. From the boldest designs
              to the most unique pieces, find exactly what fits your style.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 pb-20 relative z-10">
        <CategoryProductContent
          categorySlug={slug}
          categoryName={category.name}
          minPrice={qSearchParams?.minPrice as string | undefined}
          maxPrice={qSearchParams?.maxPrice as string | undefined}
          searchQuery={qSearchParams?.q as string | undefined}
          availability={
            qSearchParams?.availability as ProductWithAvailability | undefined
          }
        />
      </div>
    </div>
  );
}
