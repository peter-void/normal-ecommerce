"use client";

import { GetAllProductsProps } from "@/app/(consumer)/products/page";
import { FeaturedProductCard } from "./featured-product-card";
import { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface FeaturedProductsClientProps {
  initialProducts: GetAllProductsProps[];
}

export function FeaturedProductsClient({
  initialProducts,
}: FeaturedProductsClientProps) {
  const [activeTab, setActiveTab] = useState<"terbaru" | "terlaris">(
    "terlaris",
  );

  const sortedProducts = [...initialProducts].sort((a, b) => {
    if (activeTab === "terbaru") {
      return (
        new Date(b.createdAt ?? "0").getTime() -
        new Date(a.createdAt ?? "0").getTime()
      );
    } else {
      // "Terlaris" - sort ascending by price as a proxy
      return Number(a.price) - Number(b.price);
    }
  });

  return (
    <div className="flex flex-col gap-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-gray-400 mb-1">
            ✦ HANDPICKED FOR YOU
          </p>
          <h2
            className="font-black uppercase tracking-tight leading-[0.9] text-black"
            style={{ fontSize: "clamp(28px, 4vw, 52px)" }}
          >
            FEATURED PRODUCTS
          </h2>
        </div>

        <Link
          href="/products"
          className="text-black font-semibold text-sm underline underline-offset-4 hover:text-gray-500 transition-colors whitespace-nowrap"
        >
          Lihat Semua →
        </Link>
      </div>

      {/* Sort Tabs */}
      <div className="flex items-center gap-0 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("terlaris")}
          className={cn(
            "text-sm px-5 py-2.5 font-semibold transition-all border-b-2 -mb-[2px]",
            activeTab === "terlaris"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-black",
          )}
        >
          Produk Terlaris
        </button>

        <button
          onClick={() => setActiveTab("terbaru")}
          className={cn(
            "text-sm px-5 py-2.5 font-semibold transition-all border-b-2 -mb-[2px]",
            activeTab === "terbaru"
              ? "border-black text-black"
              : "border-transparent text-gray-400 hover:text-black",
          )}
        >
          Produk Terbaru
        </button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
        {sortedProducts.map((product) => (
          <FeaturedProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
