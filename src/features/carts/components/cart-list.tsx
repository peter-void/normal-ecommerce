"use client";

import { CartItem } from "./cart-item";
import { fetchCartItems } from "../actions/action";
import { CartItemType } from "@/types";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

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
  const [items, setItems] = useState<CartItemType[]>(initialItems);
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

      setItems((prev) => [...prev, ...result.items]);

      setCursor(result.nextCursor);

      setHasMore(result.hasMore);
    } catch (error) {
      console.error("Failed to load more items:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <CartItem key={item.id} item={item} />
      ))}
      {loading && (
        <div className="flex items-center justify-center py-4 gap-2 text-muted-foreground">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span>Loading more...</span>
        </div>
      )}

      {hasMore && <div ref={sentinelRef} className="h-4" />}

      {!hasMore && items.length > 0 && (
        <p className="text-center text-muted-foreground py-4 text-sm">
          You've reached the end of your cart
        </p>
      )}
    </div>
  );
}
