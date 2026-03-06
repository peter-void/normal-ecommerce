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
  maxWindow: number = 5,
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
    if (start > 2) pages.push("ellipsis");
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

  const navBtn = (disabled: boolean) =>
    cn(
      "flex items-center justify-center w-8 h-8 border border-gray-300 bg-white text-gray-500 transition-colors",
      !disabled &&
        "hover:bg-black hover:text-white hover:border-black cursor-pointer",
      disabled && "opacity-30 cursor-not-allowed pointer-events-none",
    );

  return (
    <div className="flex items-center gap-1.5">
      <Link
        href={isFirstPage ? "#" : `?page=${currentPage - 1}`}
        className={navBtn(isFirstPage)}
        aria-label="Previous page"
        aria-disabled={isFirstPage}
        onClick={(e) => isFirstPage && e.preventDefault()}
      >
        <ChevronLeftIcon className="w-4 h-4" />
      </Link>

      <div className="flex items-center gap-1">
        {pages.map((p, i) =>
          p === "ellipsis" ? (
            <span
              key={`e-${i}`}
              className="w-8 text-center text-xs text-gray-400 select-none"
            >
              …
            </span>
          ) : (
            <Link
              key={p}
              href={`?page=${p}`}
              scroll={false}
              className={cn(
                "flex items-center justify-center w-8 h-8 border text-xs font-bold transition-colors",
                p === currentPage
                  ? "bg-black text-white border-black"
                  : "border-gray-300 bg-white text-gray-600 hover:bg-black hover:text-white hover:border-black",
              )}
            >
              {p}
            </Link>
          ),
        )}
      </div>

      <Link
        href={isLastPage ? "#" : `?page=${currentPage + 1}`}
        className={navBtn(isLastPage)}
        aria-label="Next page"
        aria-disabled={isLastPage}
        onClick={(e) => isLastPage && e.preventDefault()}
      >
        <ChevronRightIcon className="w-4 h-4" />
      </Link>
    </div>
  );
}
