"use client";

import { OrderWithItems } from "@/app/(consumer)/profile/order/[id]/page";
import { motion } from "framer-motion";
import { OrderCard } from "./order-card";

interface OrderListProps {
  orders: OrderWithItems[];
}

export function OrderList({ orders }: OrderListProps) {
  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-6">
        <div className="w-40 h-40 bg-gray-100 border-4 border-black rounded-full flex items-center justify-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <span className="text-6xl">📦</span>
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-black uppercase tracking-tight">
            No Orders Yet
          </h2>
          <p className="text-muted-foreground font-medium max-w-sm mx-auto">
            It looks like you haven't bought anything cool yet. Start shopping!
          </p>
        </div>
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
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <OrderCard order={order} />
        </motion.div>
      ))}
    </div>
  );
}
