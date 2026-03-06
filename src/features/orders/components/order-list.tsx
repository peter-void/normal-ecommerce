"use client";

import { OrderWithOrderItem } from "@/app/(consumer)/profile/order/page";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { Loader2, PackageIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { getUserOrdersAction } from "../actions/action";
import { OrderCard } from "./order-card";

interface OrderListProps {
  initialOrders: OrderWithOrderItem[];
  initialCursor?: string;
  initialHasMore: boolean;
}

export function OrderList({
  initialOrders,
  initialCursor,
  initialHasMore,
}: OrderListProps) {
  const [orders, setOrders] = useState<OrderWithOrderItem[]>(initialOrders);
  const [cursor, setCursor] = useState<string | undefined>(initialCursor);
  const [hasMore, setHasMore] = useState<boolean>(initialHasMore);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(loadMoreRef, {
    margin: "0px 0px 400px 0px",
  });

  const handleLoadMore = useCallback(async () => {
    if (isLoading) return;

    setIsLoading(true);
    try {
      const { items, nextCursor, hasMore } = await getUserOrdersAction(cursor);
      setOrders((prev) => [...prev, ...items]);
      setCursor(nextCursor);
      setHasMore(hasMore);
    } finally {
      setIsLoading(false);
    }
  }, [cursor, isLoading]);

  useEffect(() => {
    if (isInView && hasMore && !isLoading) {
      handleLoadMore();
    }
  }, [isInView, hasMore, isLoading, handleLoadMore]);

  if (orders.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 border border-dashed border-gray-300 bg-gray-50">
        <div className="w-16 h-16 bg-black flex items-center justify-center mb-6">
          <PackageIcon className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-xl font-black uppercase tracking-tight text-black mb-2">
          No Orders Yet
        </h2>
        <p className="text-gray-500 text-sm text-center max-w-xs mb-8">
          You haven&apos;t placed any orders yet. Start shopping and your orders
          will appear here.
        </p>
        <Link href="/products">
          <Button className="h-11 px-8 font-bold bg-black text-white hover:bg-gray-800 uppercase tracking-widest text-xs rounded-none">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {orders.map((order, index) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
        >
          <OrderCard order={order} />
        </motion.div>
      ))}

      <div ref={loadMoreRef} className="h-4 -mt-4 pointer-events-none" />

      {hasMore && (
        <div className="flex justify-center py-12">
          <div className="border border-gray-200 p-4 flex items-center gap-3">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="font-semibold uppercase tracking-widest text-xs text-gray-500">
              Loading More Orders...
            </span>
          </div>
        </div>
      )}

      {!hasMore && orders.length > 0 && (
        <div className="text-center py-8 border-t border-gray-100">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            — End of orders —
          </p>
        </div>
      )}
    </div>
  );
}
