"use client";

import { CartItem } from "./cart-item";
import { AnimatePresence } from "framer-motion";
import { CartItemType } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchCartItems } from "../actions/action";
import { useCartItem } from "@/hooks/use-cart-item";

interface CartListProps {
  initialItems: CartItemType[];
  initialCursor?: string;
  initialHasMore: boolean;
}

export function CartList({
  initialItems,
  initialCursor,
  initialHasMore,
}: CartListProps) {
  const { setCartItems, cartItems } = useCartItem();

  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const sentinel = entries[0];

        if (sentinel.isIntersecting && hasMore && !loading) {
          loadMore();
        }
      },
      {
        threshold: 1.0,
        rootMargin: "100px",
      }
    );
    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loading, cursor]);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const result = await fetchCartItems(cursor);

      setCartItems((prev) => [...prev, ...result.items]);

      setCursor(result.nextCursor);

      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCartItems(initialItems);
  }, []);

  return (
    <div className="space-y-6">
      <AnimatePresence mode="popLayout">
        {cartItems.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}
      </AnimatePresence>
      {loading && (
        <div className="flex items-center justify-center py-6 gap-2 font-bold uppercase">
          <div className="w-6 h-6 border-4 border-black border-t-transparent rounded-full animate-spin" />
          <span>Loading more loot...</span>
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-4" />}

      {!hasMore && cartItems.length > 0 && (
        <div className="flex items-center justify-center my-8">
          <span className="bg-black text-white px-4 py-1 font-mono text-sm uppercase -rotate-1">
            End of list
          </span>
        </div>
      )}
    </div>
  );
}
