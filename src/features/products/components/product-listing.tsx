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
import { ChevronDownIcon, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getAllProductsAction } from "../actions/action";

interface ProductListingProps {
  initialProducts: GetAllProductsProps[];
  initialCursor?: string;
  initialHasMore: boolean;
  initialQ?: string;
}

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

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortOption, setSortOption] = useState<SortOption>(
    (searchParams.get("sort") as SortOption) || SortOption.NEWEST
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
      qPlaceholder
    );
    setProducts([...products, ...items]);
    setCursor(nextCursor);
    setHasMore(hasMore);
    setIsLoading(false);
  };

  const onSearch = (q: string) => {
    const params = new URLSearchParams(window.location.search);
    params.set("q", q);
    router.push(`?${params.toString()}`);
  };

  const search = (q: string) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      onSearch(q);
    }, 500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setQPlaceholder(query);
    search(query);
  };

  const handleClearFilters = () => {
    router.push(`${window.location.origin}${window.location.pathname}`);
    setQPlaceholder("");
    setSelectedCategory("all");
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

  return (
    <div className="flex flex-col gap-12">
      <div className="sticky top-24 z-30 bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-center md:justify-start"></div>

        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end flex-1">
          <div className="relative flex-1 group">
            <input
              type="text"
              placeholder="Search within category..."
              className="w-full h-14 border-4 border-black p-6 pl-14 font-bold focus:outline-none focus:bg-pink-50 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-colors italic"
              value={qPlaceholder}
              onChange={handleInputChange}
            />
            <svg
              className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 group-focus-within:rotate-90 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="3"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <div className="text-sm font-bold uppercase hidden sm:block">
            Showing <span className="text-blue-600">{products.length}</span>{" "}
            Products
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="bg-white border-2 border-black font-bold uppercase h-10 gap-2 hover:bg-yellow-400 hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]">
                Sort By: {sortOption.replace("-", " ")}
                <ChevronDownIcon className="size-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-48 border-2 border-black rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-0 mt-1"
            >
              <DropdownMenuItem
                onClick={() => setSortOption(SortOption.NEWEST)}
                className="font-bold uppercase focus:bg-pink-400 focus:text-white rounded-none cursor-pointer p-3 border-b border-gray-100"
              >
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption(SortOption.PRICE_ASC)}
                className="font-bold uppercase focus:bg-pink-400 focus:text-white rounded-none cursor-pointer p-3 border-b border-gray-100"
              >
                Price: Low to High
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setSortOption(SortOption.PRICE_DESC)}
                className="font-bold uppercase focus:bg-pink-400 focus:text-white rounded-none cursor-pointer p-3"
              >
                Price: High to Low
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="min-h-[500px]">
        <AnimatePresence mode="wait">
          {products.length > 0 ? (
            <motion.div
              key={selectedCategory + sortOption}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
            >
              {products.map((product) => (
                <FeaturedProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 border-4 border-dashed border-gray-300 bg-gray-50 rounded-lg text-center"
            >
              <h3 className="text-2xl font-black uppercase text-gray-400 mb-2">
                No Products Found
              </h3>
              <p className="text-gray-500">
                Try changing the category or clear filters.
              </p>
              <Button
                onClick={handleClearFilters}
                className="mt-6 border-2 border-black bg-white text-black hover:bg-black hover:text-white"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div ref={loadMoreRef} className="h-4 -mt-4 pointer-events-none" />

      {hasMore && (
        <div className="flex justify-center py-12">
          <div className="bg-white border-4 border-black p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="font-black uppercase tracking-widest text-sm">
              Loading More...
            </span>
          </div>
        </div>
      )}

      {!hasMore && products.length > 0 && (
        <div className="text-center py-12 border-t-4 border-black border-dashed">
          <p className="font-black uppercase text-xl italic text-neutral-400">
            You've reached the end of products
          </p>
        </div>
      )}

      {products.length === 0 && !isLoading && (
        <div className="flex flex-col items-center justify-center py-32 text-center bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
          <h2 className="text-4xl font-black uppercase mb-4 italic">
            No Products Yet!
          </h2>
          <p className="text-neutral-500 font-bold max-w-md mx-auto px-4">
            It looks like there are no products in the{" "}
            <span className="text-pink-500">{selectedCategory}</span> category
            right now. Check back soon for new arrivals!
          </p>
        </div>
      )}
    </div>
  );
}
