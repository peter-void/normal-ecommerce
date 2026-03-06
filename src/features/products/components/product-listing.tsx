"use client";

import { GetAllProductsProps } from "@/app/(consumer)/products/page";
import { FeaturedProductCard } from "@/components/homepage/featured-product-card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SortOption } from "@/constants";
import { AnimatePresence, motion, useInView } from "framer-motion";
import {
  ChevronDownIcon,
  Loader2,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAllProductsAction } from "../actions/action";
import { cn } from "@/lib/utils";

interface ProductListingProps {
  initialProducts: GetAllProductsProps[];
  initialCursor?: string;
  initialHasMore: boolean;
  initialQ?: string;
}

const SORT_LABELS: Record<SortOption, string> = {
  [SortOption.NEWEST]: "Newest First",
  [SortOption.PRICE_ASC]: "Price: Low → High",
  [SortOption.PRICE_DESC]: "Price: High → Low",
};

export function ProductListing({
  initialProducts,
  initialHasMore,
  initialCursor,
  initialQ,
}: ProductListingProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [products, setProducts] =
    useState<GetAllProductsProps[]>(initialProducts);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [qPlaceholder, setQPlaceholder] = useState<string>(initialQ || "");
  const [sortOption, setSortOption] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || SortOption.NEWEST,
  );

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, {
    margin: "0px 0px 400px 0px",
  });

  const timer = useRef<NodeJS.Timeout>(undefined);

  const handleLoadMore = async () => {
    setIsLoading(true);
    const { items, nextCursor, hasMore } = await getAllProductsAction(
      cursor,
      sortOption,
      qPlaceholder,
    );
    setProducts((prev) => [...prev, ...items]);
    setCursor(nextCursor);
    setHasMore(hasMore);
    setIsLoading(false);
  };

  const onSearch = (q: string) => {
    const params = new URLSearchParams(window.location.search);
    if (q) {
      params.set("q", q);
    } else {
      params.delete("q");
    }
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const search = (q: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onSearch(q);
    }, 700);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQPlaceholder(query);
    search(query);
  };

  const handleClearSearch = () => {
    setQPlaceholder("");
    onSearch("");
  };

  const handleClearFilters = () => {
    router.replace(window.location.pathname, { scroll: false });
    setQPlaceholder("");
    setSortOption(SortOption.NEWEST);
  };

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      handleLoadMore();
    }
  }, [isInView, hasMore, isLoading]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    params.set("sort", sortOption);
    router.push(`?${params.toString()}`);
  }, [sortOption]);

  useEffect(() => {
    setProducts(initialProducts);
    setCursor(initialCursor);
    setHasMore(initialHasMore);
  }, [initialProducts, initialCursor, initialHasMore]);

  const hasActiveFilters = qPlaceholder || sortOption !== SortOption.NEWEST;

  return (
    <div className="flex flex-col gap-8">
      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between border-b border-gray-200 pb-6">
        {/* Search */}
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari produk..."
            className="w-full h-10 border border-gray-300 pl-9 pr-9 text-sm focus:outline-none focus:border-black transition-colors"
            value={qPlaceholder}
            onChange={handleInputChange}
          />
          {qPlaceholder && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Right side: count + sort */}
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
          <p className="text-sm text-gray-500">
            <span className="font-bold text-black">{products.length}</span>{" "}
            produk
            {hasActiveFilters && (
              <button
                onClick={handleClearFilters}
                className="ml-3 text-xs underline underline-offset-2 text-gray-400 hover:text-black transition-colors"
              >
                Reset filter
              </button>
            )}
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-10 px-4 border border-black rounded-none text-sm font-semibold gap-2 bg-white text-black hover:bg-gray-50 whitespace-nowrap min-w-[180px]">
                <SlidersHorizontal className="w-4 h-4 shrink-0" />
                <span className="truncate">{SORT_LABELS[sortOption]}</span>
                <ChevronDownIcon className="w-4 h-4 ml-1 shrink-0" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 border border-gray-200 rounded-none p-1 bg-white mt-1"
            >
              {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => setSortOption(opt)}
                  className={cn(
                    "cursor-pointer text-sm py-2 px-3 rounded-none focus:bg-gray-100 focus:text-black",
                    sortOption === opt ? "font-bold bg-gray-50" : "font-medium",
                  )}
                >
                  {SORT_LABELS[opt]}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Grid */}
      <div className="min-h-[400px]">
        <AnimatePresence mode="wait">
          {products.length > 0 ? (
            <motion.div
              key={sortOption}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8"
            >
              {products.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-32 text-center"
            >
              <p className="text-5xl mb-4">🔍</p>
              <h3 className="text-xl font-black uppercase tracking-tight text-black mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500 text-sm max-w-xs">
                Tidak ada produk yang cocok dengan pencarian Anda.
              </p>
              <Button
                onClick={handleClearFilters}
                className="mt-6 rounded-none bg-black text-white hover:bg-gray-800 font-bold uppercase text-xs tracking-wider px-6 h-10"
              >
                Reset Filter
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Infinite scroll sentinel */}
      <div ref={loadMoreRef} className="h-4 pointer-events-none" />

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-3 text-sm font-semibold uppercase tracking-widest text-gray-500">
            <Loader2 className="w-5 h-5 animate-spin" />
            Loading more...
          </div>
        </div>
      )}

      {/* End of results */}
      {!hasMore && products.length > 0 && !isLoading && (
        <div className="text-center py-10 border-t border-gray-100">
          <p className="text-xs uppercase tracking-widest font-semibold text-gray-400">
            — End of results —
          </p>
        </div>
      )}
    </div>
  );
}
