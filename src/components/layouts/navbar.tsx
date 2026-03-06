"use client";

import { NAVBAR_LINKS, NavbarLabel } from "@/constants";
import { Category } from "@/generated/prisma/client";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDownIcon, ShoppingCartIcon, UserIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

interface NavbarProps {
  categories?: Pick<Category, "id" | "name" | "slug">[];
}

export function Navbar({ categories = [] }: NavbarProps) {
  const pathname = usePathname();
  const { data: session, isPending: sessionPending } = authClient.useSession();
  const [isCategoryHovered, setIsCategoryHovered] = useState(false);

  const displayCategories = categories.slice(0, 18);
  const hasMoreCategories = categories.length > 18;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex flex-col bg-white">
      {/* Main Navbar */}
      <div className="bg-white border-b border-gray-300 h-[72px] flex items-center">
        <div className="flex items-center justify-between w-full px-4 lg:px-10 relative">
          {/* Logo */}
          <div className="flex items-center shrink-0 w-48 md:w-56">
            <Link
              href="/"
              className="font-black text-2xl md:text-3xl uppercase tracking-tighter text-black hover:opacity-80 transition-opacity"
            >
              BRUTAL SHOP
            </Link>
          </div>

          {/* Nav links (Center) */}
          <nav className="md:flex items-center justify-center gap-x-6 hidden h-full grow">
            <Link
              href="/products"
              className={cn(
                "font-extrabold uppercase text-[13px] tracking-wide transition-all duration-200 text-black hover:underline underline-offset-8",
                pathname === "/products" && "underline underline-offset-8",
              )}
            >
              ALL PRODUCTS
            </Link>

            {NAVBAR_LINKS.map((nLink) => {
              const isCategory = nLink.label === NavbarLabel.Categories;
              const isCollections = nLink.label === NavbarLabel.Collections;

              if (isCollections) return null;

              if (isCategory) {
                return (
                  <div
                    key={nLink.label}
                    className="relative h-[72px] flex items-center"
                    onMouseEnter={() => setIsCategoryHovered(true)}
                    onMouseLeave={() => setIsCategoryHovered(false)}
                  >
                    <button
                      className={cn(
                        "flex items-center gap-x-1 font-extrabold uppercase text-[13px] tracking-wide text-black hover:underline underline-offset-8 transition-all duration-200",
                        isCategoryHovered && "underline underline-offset-8",
                      )}
                    >
                      {nLink.label}
                      <ChevronDownIcon
                        className={cn(
                          "size-4 transition-transform duration-200",
                          isCategoryHovered && "rotate-180",
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {isCategoryHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 0 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 0 }}
                          transition={{ duration: 0.1 }}
                          className="absolute top-full left-1/2 -translate-x-1/2 w-screen max-w-5xl pt-0"
                        >
                          <div className="bg-white border-b border-gray-200 shadow-xl p-8">
                            <h3 className="font-black text-xl mb-6 uppercase tracking-tight text-black flex items-center gap-3">
                              CATEGORIES
                              <span className="text-xs font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-sm">
                                {categories.length}
                              </span>
                            </h3>

                            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-y-2 gap-x-4">
                              {displayCategories.map((cat) => (
                                <Link
                                  key={cat.id}
                                  href={`/categories/${cat.slug}`}
                                  className="group/cat block"
                                >
                                  <span className="font-semibold text-sm text-gray-600 group-hover/cat:text-black group-hover/cat:underline underline-offset-4 uppercase transition-all duration-200">
                                    {cat.name}
                                  </span>
                                </Link>
                              ))}

                              {hasMoreCategories && (
                                <Link
                                  href="/categories"
                                  className="group/cat block"
                                >
                                  <span className="font-bold text-sm text-black underline underline-offset-4 flex items-center gap-1">
                                    +{categories.length - 18} MORE →
                                  </span>
                                </Link>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

              return null;
            })}
          </nav>

          {/* Right Area (Icons only, no search) */}
          <div className="flex items-center justify-end gap-x-4 shrink-0 w-auto md:w-56">
            <Link
              href="/cart"
              className="text-black hover:opacity-70 transition-opacity p-2"
            >
              <ShoppingCartIcon className="size-5" strokeWidth={2} />
            </Link>

            <Link
              href={
                sessionPending ? "/" : session ? "/profile" : "/auth/signin"
              }
              className="text-black hover:opacity-70 transition-opacity p-2"
            >
              <UserIcon className="size-5" strokeWidth={2} />
            </Link>

            {!sessionPending && session && session.user.isAdmin && (
              <Link
                href="/admin"
                className="hidden md:flex items-center px-4 py-2 bg-black text-white text-xs font-bold uppercase tracking-widest hover:bg-gray-800 transition-colors duration-200 ml-2"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
