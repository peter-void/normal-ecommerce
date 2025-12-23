"use client";

import { HoverColor, NAVBAR_LINKS, NavbarLabel } from "@/constants";
import { Category } from "@/generated/prisma/client";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDownIcon,
  ChevronRightIcon,
  SearchIcon,
  ShoppingCartIcon,
  UserIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Button } from "../ui/button";

interface NavbarProps {
  categories?: Pick<Category, "id" | "name" | "slug">[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const pathname = usePathname();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);

  const displayCategories = categories.slice(0, 12);
  const hasMoreCategories = categories.length > 12;

  return (
    <header className="h-20 border-b-4 border-black bg-white flex items-center fixed top-0 left-0 right-0 z-50 shadow-[0px_4px_0px_0px_rgba(0,0,0,0.1)]">
      <div className="flex items-center justify-between container mx-auto px-4 md:px-7 relative">
        {/* LOGO */}
        <div className="flex items-center z-50">
          <Button
            className="border-2 border-black bg-main hover:bg-main/90 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            size="sm"
            asChild
          >
            <Link
              href="/"
              className="font-black text-md uppercase tracking-wider"
            >
              BRUTAL SHOP
            </Link>
          </Button>
        </div>

        {/* NAVIGATION LINKS */}
        <nav className="md:flex items-center gap-x-4 hidden h-full">
          {/* ALL PRODUCT LINK */}
          <Link href="/products">
            <div
              className={cn(
                "font-bold uppercase text-sm border-2 border-transparent px-4 py-1 transition-all hover:bg-yellow-400 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1",
                pathname === "/products" &&
                  "bg-yellow-400 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
              )}
            >
              All Products
            </div>
          </Link>

          {NAVBAR_LINKS.map((nLink) => {
            const isCategory = nLink.label === NavbarLabel.Categories;
            const isActive = !isCategory && pathname === nLink.href;

            if (isCategory) {
              return (
                <div
                  key={nLink.label}
                  className="relative h-20 flex items-center"
                  onMouseEnter={() => setIsCategoryHovered(true)}
                  onMouseLeave={() => setIsCategoryHovered(false)}
                >
                  <button
                    className={cn(
                      "flex items-center gap-x-1 font-bold uppercase text-sm border-2 border-transparent px-4 py-1 transition-all",
                      isCategoryHovered
                        ? "bg-green-400 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1"
                        : "hover:bg-green-400 hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1"
                    )}
                  >
                    {nLink.label}
                    <ChevronDownIcon
                      className={cn(
                        "size-4 transition-transform duration-200",
                        isCategoryHovered && "rotate-180"
                      )}
                    />
                  </button>

                  <AnimatePresence>
                    {isCategoryHovered && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-1/2 -translate-x-1/2 w-[600px] lg:w-[800px] pt-4"
                      >
                        {/* Connecting Line/Triangle optional */}
                        <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative z-50">
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-4 border-l-4 border-black rotate-45" />

                          <div className="flex flex-col gap-6">
                            <div className="flex items-center justify-between border-b-2 border-black pb-2">
                              <h3 className="font-black text-xl italic uppercase">
                                Browse Categories
                              </h3>
                              <span className="text-xs font-bold bg-black text-white px-2 py-1">
                                {categories.length} Total
                              </span>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                              {displayCategories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/categories/${cat.slug}`}
                                  className="group relative"
                                >
                                  <div className="bg-white border-2 border-black p-3 text-center transition-all group-hover:bg-pink-400 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <span className="font-bold text-sm uppercase truncate block">
                                      {cat.name}
                                    </span>
                                  </div>
                                </Link>
                              ))}

                              {/* View All Button if overflow */}
                              {hasMoreCategories && (
                                <Link href="/categories" className="group">
                                  <div className="bg-black border-2 border-black p-3 text-center transition-all group-hover:bg-neutral-800 group-hover:-translate-y-1 group-hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)]">
                                    <span className="font-bold text-sm uppercase text-white flex items-center justify-center gap-1">
                                      View All{" "}
                                      <ChevronRightIcon className="size-4" />
                                    </span>
                                  </div>
                                </Link>
                              )}
                            </div>

                            {categories.length === 0 && (
                              <div className="text-center py-10 font-bold text-neutral-400">
                                NO CATEGORIES FOUND
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <div
                key={nLink.label}
                className={cn(
                  "font-bold uppercase text-sm border-2 border-transparent px-4 py-1 transition-all",
                  "hover:border-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1",
                  nLink.hoverColor === HoverColor.Blue && "hover:bg-blue-400",
                  nLink.hoverColor === HoverColor.Green && "hover:bg-green-400",
                  isActive &&
                    "border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 bg-white"
                )}
              >
                <Link href={nLink.href!}>{nLink.label}</Link>
              </div>
            );
          })}
        </nav>

        <div className="flex items-center gap-x-4">
          <Link
            href={sessionPending ? "/" : session ? "/profile" : "/auth/signin"}
            className="p-2 border-2 border-transparent hover:border-black hover:bg-blue-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
          >
            <UserIcon className="size-5" />
          </Link>

          <Link
            href="/cart"
            className="p-2 border-2 border-transparent hover:border-black hover:bg-red-400 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all relative"
          >
            <ShoppingCartIcon className="size-5" />
          </Link>

          {!sessionPending && session && session.user.isAdmin && (
            <Button
              size="sm"
              className="hidden md:flex bg-black text-white border-2 border-transparent hover:bg-red-500 hover:border-black hover:text-black hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all uppercase font-bold"
              asChild
            >
              <Link href="/admin">
                Admin <ChevronRightIcon className="size-4 ml-1" />
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
