"use client";

import { FeaturedProductCard } from "@/components/homepage/featured-product-card";
import { SortOption } from "@/constants";
import { ProductWithAvailability, ProductWithImages } from "@/types";
import { AnimatePresence, motion, useInView } from "framer-motion";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { getProductsByCategoryAction } from "../actions/action";
import { ListingControls } from "./listing-controls";

interface CategoryProductContentProps {
  minPrice?: string;
  maxPrice?: string;
  searchQuery?: string;
  categorySlug: string;
  categoryName: string;
  availability?: ProductWithAvailability;
}

export function CategoryProductContent({
  minPrice: initMinPrice,
  maxPrice: initMaxPrice,
  categorySlug,
  categoryName,
  searchQuery: initSearchQuery,
  availability: initAvailability,
}: CategoryProductContentProps) {
  const router = useRouter();

  const [products, setProducts] = useState<ProductWithImages[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>(SortOption.NEWEST);

  const loadMoreRef = useRef(null);
  const isInView = useInView(loadMoreRef, { margin: "0px 0px 400px 0px" });

  // Read search/filter from URL-derived props
  const searchQuery = initSearchQuery;
  const minPrice = initMinPrice;
  const maxPrice = initMaxPrice;
  const availability = initAvailability;

  const fetchProducts = async (cursor?: string, append = false) => {
    setIsLoading(true);
    try {
      const url = new URLSearchParams();
      if (cursor) url.set("cursor", cursor);
      if (searchQuery) url.set("q", searchQuery);
      if (minPrice) url.set("minPrice", minPrice);
      if (maxPrice) url.set("maxPrice", maxPrice);
      if (availability) url.set("availability", availability);
      url.set("sort", sortOption);

      const response = await fetch(
        `/api/products/by-category/${categorySlug}?${url.toString()}`,
      );

      if (!response.ok) throw new Error("Failed to fetch products");

      const data = await response.json();

      if (data.success && data.data) {
        if (append) {
          setProducts((prev) => [...prev, ...data.data.products]);
        } else {
          setProducts(data.data.products);
        }
        setHasMore(data.data.hasMore);
        setNextCursor(data.data.nextCursor);
      }
    } catch (error) {
      console.log({ error });
      toast.error("Failed to load products");
    } finally {
      setIsLoading(false);
    }
  };

  // Re-fetch when filters/sort change
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, minPrice, maxPrice, availability, sortOption, categorySlug]);

  // Infinite scroll
  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      fetchProducts(nextCursor, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, hasMore, isLoading]);

  const pushParams = (params: URLSearchParams) => {
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleSearch = (q: string) => {
    const params = new URLSearchParams(window.location.search);
    q ? params.set("q", encodeURIComponent(q)) : params.delete("q");
    pushParams(params);
  };

  const handleFilter = (
    min: string,
    max: string,
    avail: ProductWithAvailability | "",
  ) => {
    const params = new URLSearchParams(window.location.search);
    min ? params.set("minPrice", min) : params.delete("minPrice");
    max ? params.set("maxPrice", max) : params.delete("maxPrice");
    avail ? params.set("availability", avail) : params.delete("availability");
    pushParams(params);
  };

  const handleResetFilter = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("minPrice");
    params.delete("maxPrice");
    params.delete("availability");
    pushParams(params);
  };

  const handleSort = (sort: SortOption) => {
    setSortOption(sort);
  };

  const activeFilterCount =
    (minPrice ? 1 : 0) + (maxPrice ? 1 : 0) + (availability ? 1 : 0);

  return (
    <div className="flex flex-col gap-12">
      <ListingControls
        searchQuery={searchQuery || ""}
        onSearch={handleSearch}
        onFilter={handleFilter}
        onResetFilter={handleResetFilter}
        onSort={handleSort}
        currentSort={sortOption}
        initMinPrice={minPrice || ""}
        initMaxPrice={maxPrice || ""}
        activeFilterCount={activeFilterCount}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence>
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: (index % 4) * 0.1 }}
            >
              <FeaturedProductCard
                product={
                  {
                    ...product,
                    price: product.price as any,
                    weight: product.weight as any,
                    category: { name: categoryName } as any,
                  } as any
                }
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div ref={loadMoreRef} className="h-4 -mt-4 pointer-events-none" />

      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading...
          </div>
        </div>
      )}

      {!hasMore && products.length > 0 && !isLoading && (
        <div className="text-center py-10 border-t border-gray-100">
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-400">
            — End of results —
          </p>
        </div>
      )}

      {products.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <p className="text-5xl mb-4">🔍</p>
          <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2">
            No Products Found
          </h3>
          <p className="text-gray-500 text-sm max-w-xs">
            Try adjusting your filters or search query.
          </p>
          <button
            onClick={handleResetFilter}
            className="mt-6 h-10 px-6 bg-black text-white text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
