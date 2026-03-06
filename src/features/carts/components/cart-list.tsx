"use client";

import { useCartItem } from "@/hooks/use-cart-item";
import { CartItemType } from "@/types";
import { AnimatePresence, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { fetchCartItems } from "../actions/action";
import { CartItem } from "./cart-item";

interface CartListProps {
  initialItems: CartItemType[];
  initialCursor?: string;
  initialHasMore: boolean;
  initialSelectedIds: string[];
}

export function CartList({
  initialItems,
  initialCursor,
  initialHasMore,
  initialSelectedIds,
}: CartListProps) {
  const { setCartItems, cartItems, setSelectedItems } = useCartItem();

  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sentinelRef, {
    margin: "0px 0px 400px 0px",
  });

  useEffect(() => {
    if (isInView && hasMore && !loading) {
      loadMore();
    }
  }, [isInView, hasMore, loading]);

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
    setSelectedItems(initialSelectedIds);
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
