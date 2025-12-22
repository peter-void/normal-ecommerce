"use client";

import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import Link from "next/link";

interface PaginationProps {
  page?: string;
  totalPages: number;
  hasNextPage?: boolean;
  maxWindow?: number;
}

type PageItem = number | "ellipsis";

function getPagesToShow(
  totalPages: number,
  currentPage: number,
  maxWindow: number = 5
): PageItem[] {
  totalPages = Math.max(1, Math.floor(totalPages));
  currentPage = Math.min(Math.max(Number(currentPage), 1), totalPages);
  maxWindow = Math.max(1, Math.floor(maxWindow));

  if (totalPages <= maxWindow) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const half = Math.floor(maxWindow / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = Math.min(totalPages, start + maxWindow - 1);
  }

  if (end > totalPages) {
    end = totalPages;
    start = Math.max(1, totalPages - maxWindow + 1);
  }

  const pages: PageItem[] = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) {
      pages.push("ellipsis");
    }
  }

  for (let p = start; p <= end; p++) pages.push(p);

  if (end < totalPages) {
    if (end < totalPages - 1) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return pages;
}

export function Pagination(props: PaginationProps) {
  const { page = "1", totalPages, hasNextPage, maxWindow = 5 } = props;
  const currentPage = Math.min(Math.max(Number(page), 1), totalPages);

  const derivedHasNext =
    typeof hasNextPage === "boolean" ? hasNextPage : currentPage < totalPages;

  const pages = getPagesToShow(totalPages, currentPage, maxWindow);
  const isFirstPage = currentPage === 1;
  const isLastPage = !derivedHasNext;

  return (
    <div className="flex flex-wrap items-center justify-center gap-3 py-4">
      <Link
        href={isFirstPage ? "#" : `?page=${currentPage - 1}`}
        className={cn(
          "flex items-center justify-center w-12 h-12 border-2 border-black bg-white transition-all duration-200",
          !isFirstPage &&
            "hover:bg-yellow-400 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none",
          isFirstPage &&
            "opacity-40 cursor-not-allowed bg-neutral-100 border-neutral-300 pointer-events-none"
        )}
        aria-label="Previous page"
        aria-disabled={isFirstPage}
        onClick={(e) => isFirstPage && e.preventDefault()}
      >
        <ChevronLeftIcon className="w-6 h-6 stroke-3" />
      </Link>

      <div className="flex items-center gap-2">
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`e-${i}`}
              className="flex items-end justify-center w-8 h-12 font-black text-2xl tracking-widest pb-2 select-none"
            >
              ...
            </span>
          ) : (
            <Link
              key={p}
              href={`?page=${p}`}
              scroll={false}
              className={cn(
                "flex items-center justify-center w-12 h-12 border-2 border-black font-black text-lg transition-all duration-200",
                p === currentPage
                  ? "bg-black text-white -translate-y-1 translate-x-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.4)]"
                  : "bg-white text-black hover:bg-pink-400 hover:text-white hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              )}
            >
              {p}
            </Link>
          )
        )}
      </div>

      <Link
        href={isLastPage ? "#" : `?page=${currentPage + 1}`}
        className={cn(
          "flex items-center justify-center w-12 h-12 border-2 border-black bg-white transition-all duration-200",
          !isLastPage &&
            "hover:bg-yellow-400 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:translate-x-0 active:shadow-none",
          isLastPage &&
            "opacity-40 cursor-not-allowed bg-neutral-100 border-neutral-300 pointer-events-none"
        )}
        aria-label="Next page"
        aria-disabled={isLastPage}
        onClick={(e) => isLastPage && e.preventDefault()}
      >
        <ChevronRightIcon className="w-6 h-6 stroke-[3]" />
      </Link>
    </div>
  );
}
