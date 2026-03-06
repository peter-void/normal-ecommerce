"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { SortOption } from "@/constants";
import { formatRupiah, parseRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { ProductWithAvailability } from "@/types";
import { ChevronDown, SlidersHorizontal, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const SORT_LABELS: Record<SortOption, string> = {
  [SortOption.NEWEST]: "Latest Arrivals",
  [SortOption.PRICE_ASC]: "Price: Low → High",
  [SortOption.PRICE_DESC]: "Price: High → Low",
  [SortOption.BEST_SELLERS]: "Best Sellers",
};

interface ListingControlsProps {
  searchQuery: string;
  onSearch: (q: string) => void;
  onFilter: (
    minPrice: string,
    maxPrice: string,
    availability: ProductWithAvailability | "",
  ) => void;
  onResetFilter: () => void;
  onSort: (sort: SortOption) => void;
  currentSort: SortOption;
  initMinPrice?: string;
  initMaxPrice?: string;
  activeFilterCount?: number;
}

export function ListingControls({
  onSearch,
  searchQuery,
  onFilter,
  onResetFilter,
  onSort,
  currentSort,
  initMinPrice,
  initMaxPrice,
  activeFilterCount = 0,
}: ListingControlsProps) {
  const [qPlaceholder, setQPlaceholder] = useState<string>("");
  const [minPrice, setMinPrice] = useState<string>(initMinPrice ?? "");
  const [maxPrice, setMaxPrice] = useState<string>(initMaxPrice ?? "");
  const [selectedAvailability, setSelectedAvailability] = useState<
    ProductWithAvailability | ""
  >("");
  const [sheetOpen, setSheetOpen] = useState(false);

  const timer = useRef<NodeJS.Timeout>(undefined);

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

  useEffect(() => {
    const decodedQuery = decodeURIComponent(searchQuery);
    setQPlaceholder(decodedQuery);
  }, [searchQuery]);

  const handleApply = () => {
    if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
      toast.error("Min price must be less than max price");
      return;
    }
    onFilter(minPrice, maxPrice, selectedAvailability);
    setSheetOpen(false);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setSelectedAvailability("");
    onResetFilter();
    setSheetOpen(false);
  };

  const totalActive =
    activeFilterCount +
    (minPrice ? 1 : 0) +
    (maxPrice ? 1 : 0) +
    (selectedAvailability ? 1 : 0);

  return (
    <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-center relative">
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 flex-1 w-full justify-between">
        {/* Search Bar */}
        <div className="relative group w-full max-w-sm">
          <input
            type="text"
            placeholder="Search within category..."
            className="w-full h-10 border border-gray-300 px-4 pl-10 text-sm focus:outline-none focus:border-black transition-colors"
            value={qPlaceholder}
            onChange={handleInputChange}
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          {qPlaceholder && (
            <button
              onClick={() => {
                setQPlaceholder("");
                onSearch("");
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Filter Sheet */}
          <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
            <SheetTrigger asChild>
              <Button className="h-10 px-4 border border-gray-300 rounded-none bg-white text-black hover:bg-gray-50 hover:border-black transition-colors flex gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="font-bold text-sm">Filters</span>
                {totalActive > 0 && (
                  <div className="bg-black text-white px-1.5 py-0.5 text-[10px] min-w-[18px] flex items-center justify-center">
                    {totalActive}
                  </div>
                )}
              </Button>
            </SheetTrigger>
            <SheetContent className="border-l border-gray-200 p-0 sm:max-w-sm">
              <div className="h-full flex flex-col bg-white">
                <SheetHeader className="p-6 border-b border-gray-200">
                  <SheetTitle className="text-xl font-black uppercase tracking-tight">
                    Filter Products
                  </SheetTitle>
                  <SheetDescription className="text-gray-500 text-sm mt-1">
                    Narrow down results.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                  {/* Price Range */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">
                      Price Range
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Min Price
                        </label>
                        <input
                          type="text"
                          placeholder="Rp 0"
                          className="w-full h-10 border border-gray-300 px-3 text-sm focus:outline-none focus:border-black transition-colors"
                          value={formatRupiah(minPrice) || ""}
                          onChange={(e) =>
                            setMinPrice(parseRupiah(e.target.value).toString())
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500">
                          Max Price
                        </label>
                        <input
                          type="text"
                          placeholder="No limit"
                          className="w-full h-10 border border-gray-300 px-3 text-sm focus:outline-none focus:border-black transition-colors"
                          value={formatRupiah(maxPrice) || ""}
                          onChange={(e) =>
                            setMaxPrice(parseRupiah(e.target.value).toString())
                          }
                        />
                      </div>
                    </div>
                    {/* Quick price presets */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { label: "Under 500K", max: "500000" },
                        { label: "500K – 1M", min: "500000", max: "1000000" },
                        { label: "1M – 3M", min: "1000000", max: "3000000" },
                        { label: "Over 3M", min: "3000000" },
                      ].map((p) => (
                        <button
                          key={p.label}
                          onClick={() => {
                            setMinPrice(p.min ?? "");
                            setMaxPrice(p.max ?? "");
                          }}
                          className={cn(
                            "text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border transition-colors",
                            minPrice === (p.min ?? "") &&
                              maxPrice === (p.max ?? "")
                              ? "border-black bg-black text-white"
                              : "border-gray-200 text-gray-600 hover:border-black",
                          )}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Availability */}
                  <div className="space-y-4">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 border-b border-gray-100 pb-2">
                      Availability
                    </h3>
                    <div className="flex flex-col gap-2">
                      {[
                        { value: "", label: "All Items" },
                        { value: "in_stock", label: "In Stock" },
                        { value: "out_of_stock", label: "Out of Stock" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() =>
                            setSelectedAvailability(
                              opt.value as ProductWithAvailability | "",
                            )
                          }
                          className={cn(
                            "flex items-center justify-between h-10 px-4 border text-sm font-bold transition-colors text-left",
                            selectedAvailability === opt.value
                              ? "border-black bg-black text-white"
                              : "border-gray-200 text-gray-700 hover:border-black",
                          )}
                        >
                          {opt.label}
                          {selectedAvailability === opt.value && (
                            <span className="w-2 h-2 rounded-full bg-white shrink-0" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-200 flex gap-3">
                  <Button
                    className="flex-1 h-11 rounded-none bg-black text-white font-black uppercase text-xs tracking-widest hover:bg-gray-800"
                    onClick={handleApply}
                  >
                    Apply Filters
                  </Button>
                  <Button
                    variant="outline"
                    className="h-11 px-5 rounded-none font-black uppercase text-xs tracking-widest border-gray-300 hover:border-black"
                    onClick={handleReset}
                  >
                    Reset
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="h-10 px-4 border border-gray-300 rounded-none bg-white text-black hover:bg-gray-50 hover:border-black transition-colors flex gap-2">
                <span className="font-bold text-sm">
                  {SORT_LABELS[currentSort]}
                </span>
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-52 border border-gray-200 rounded-none p-1 bg-white shadow-md">
              {(Object.keys(SORT_LABELS) as SortOption[]).map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => onSort(opt)}
                  className={cn(
                    "cursor-pointer text-sm py-2.5 px-3 rounded-none focus:bg-gray-100",
                    currentSort === opt
                      ? "font-black bg-gray-50"
                      : "font-medium text-gray-700",
                  )}
                >
                  {SORT_LABELS[opt]}
                  {currentSort === opt && (
                    <span className="ml-auto text-black">✓</span>
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
