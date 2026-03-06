import prisma from "@/lib/prisma";
import { ArrowRightIcon, GridIcon } from "lucide-react";
import Link from "next/link";

async function getAllCategories() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: { where: { isActive: true } } },
      },
      image: true,
    },
  });
  return categories;
}

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="min-h-screen bg-white pt-[72px]">
      {/* Page Header */}
      <div className="border-b border-gray-200 py-16 px-4 md:px-8 bg-[#f9f9f9]">
        <div className="container mx-auto">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-3">
            ✦ BROWSE THE STORE
          </p>
          <h1
            className="font-black uppercase tracking-tight leading-[0.9] text-black"
            style={{ fontSize: "clamp(40px, 7vw, 96px)" }}
          >
            ALL
          </h1>
          <h1
            className="font-black uppercase tracking-tight leading-[0.9] text-gray-300"
            style={{ fontSize: "clamp(40px, 7vw, 96px)" }}
          >
            CATEGORIES
          </h1>
          <p className="mt-6 text-gray-500 text-sm max-w-md leading-relaxed">
            Explore our full range of collections, carefully curated for every
            style and occasion.
          </p>
        </div>
      </div>

      {/* Stats strip */}
      <div className="border-b border-gray-200 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex divide-x divide-gray-200">
            <div className="px-6 py-4 first:pl-0">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Total Categories
              </p>
              <p className="text-2xl font-black tabular-nums">
                {categories.length}
              </p>
            </div>
            <div className="px-6 py-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                Total Products
              </p>
              <p className="text-2xl font-black tabular-nums">
                {categories.reduce((sum, c) => sum + c._count.products, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="container mx-auto px-4 md:px-8 py-12">
        {categories.length === 0 ? (
          <div className="py-32 flex flex-col items-center gap-4 border border-dashed border-gray-200">
            <div className="w-12 h-12 bg-black flex items-center justify-center">
              <GridIcon className="w-5 h-5 text-white" />
            </div>
            <p className="text-sm font-black uppercase tracking-widest text-gray-400">
              No categories yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group relative flex flex-col overflow-hidden border border-gray-200 hover:border-black transition-colors duration-200 bg-white"
              >
                {/* Image or placeholder */}
                <div className="relative aspect-4/3 bg-[#f5f5f5] overflow-hidden">
                  {category.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={category.image.src}
                      alt={category.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    /* Elegant placeholder with large category initial */
                    <div className="w-full h-full flex items-center justify-center">
                      <span
                        className="font-black uppercase text-gray-200 select-none"
                        style={{ fontSize: "clamp(60px, 8vw, 100px)" }}
                      >
                        {category.name.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Index number — top left */}
                  <span className="absolute top-4 left-4 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-white px-2 py-1">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  {/* Product count badge — top right */}
                  <span className="absolute top-4 right-4 text-[10px] font-black uppercase tracking-widest bg-black text-white px-2 py-1">
                    {category._count.products} items
                  </span>

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                </div>

                {/* Content */}
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-0.5">
                      Category
                    </p>
                    <h2 className="font-black text-lg uppercase tracking-tight leading-tight text-black">
                      {category.name}
                    </h2>
                    {category.description && (
                      <p className="text-xs text-gray-500 mt-1 line-clamp-1">
                        {category.description}
                      </p>
                    )}
                  </div>
                  <div className="w-9 h-9 border border-gray-200 group-hover:border-black group-hover:bg-black transition-colors duration-200 flex items-center justify-center shrink-0">
                    <ArrowRightIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors duration-200" />
                  </div>
                </div>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-black transition-all duration-500 ease-out" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
