import prisma from "@/lib/prisma";
import { serializeProduct } from "@/lib/utils";
import { formatRupiah } from "@/lib/format";
import Image from "next/image";
import Link from "next/link";
import { BellIcon } from "lucide-react";

async function getOutOfStockProducts() {
  const products = await prisma.product.findMany({
    where: {
      AND: [{ isActive: true }, { stock: 0 }],
    },
    take: 4,
    orderBy: { updatedAt: "desc" },
    include: { images: true, category: true },
  });
  return products.map(serializeProduct);
}

export async function OutOfStockSection() {
  const products = await getOutOfStockProducts();

  if (products.length === 0) return null;

  return (
    <section className="bg-[#0a0a0a] py-16 px-4 md:px-7">
      <div className="container mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-2">
              ◈ RESTOCKED SOON
            </p>
            <h2
              className="font-black uppercase tracking-tight leading-[0.9] text-white"
              style={{ fontSize: "clamp(26px, 3.5vw, 48px)" }}
            >
              COMING BACK
            </h2>
            <h2
              className="font-black uppercase tracking-tight leading-[0.9] text-gray-600"
              style={{ fontSize: "clamp(26px, 3.5vw, 48px)" }}
            >
              SOON
            </h2>
          </div>
          <p className="text-gray-500 text-xs max-w-xs leading-relaxed">
            High-demand items temporarily out of stock. Check back or browse our
            available selection.
          </p>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {(products as any[]).map((product) => (
            <Link
              key={product.id}
              href={`/product/${product.slug}`}
              className="group relative flex flex-col"
            >
              {/* Image — grayscale, desaturated */}
              <div className="relative aspect-square bg-[#1a1a1a] overflow-hidden">
                {product.images?.[0] ? (
                  <Image
                    src={product.images[0].src}
                    alt={product.name}
                    fill
                    unoptimized
                    className="object-cover grayscale opacity-50 group-hover:opacity-40 transition-opacity duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-700 font-bold uppercase text-xs">
                    No Image
                  </div>
                )}

                {/* Sold out overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60 border border-white/20 px-3 py-1.5">
                    SOLD OUT
                  </span>
                </div>

                {/* Notify hover */}
                <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <div className="bg-white text-black text-[10px] font-black uppercase tracking-[0.15em] py-3 flex items-center justify-center gap-2">
                    <BellIcon className="w-3 h-3" />
                    Check Product
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="pt-3 pb-4 flex flex-col gap-0.5">
                <p className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">
                  {product.category?.name}
                </p>
                <h3 className="text-gray-400 text-sm font-bold line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-gray-600 text-sm font-black line-through">
                  {formatRupiah(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-10 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-xs uppercase tracking-widest">
            Want to be the first to know when it&apos;s back?
          </p>
          <Link
            href="/products"
            className="text-[11px] font-black uppercase tracking-[0.2em] text-white border border-white/30 px-6 py-3 hover:bg-white hover:text-black transition-colors duration-200"
          >
            Browse Available →
          </Link>
        </div>
      </div>
    </section>
  );
}
