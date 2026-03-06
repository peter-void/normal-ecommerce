"use client";

import { OrderWithOrderItem } from "@/app/(consumer)/profile/order/page";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { format } from "date-fns";
import { CalendarIcon, ChevronRightIcon, PackageIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderCardProps {
  order: OrderWithOrderItem;
}

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-black text-white",
  completed: "bg-black text-white",
  pending: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
};

export function OrderCard({ order }: OrderCardProps) {
  const statusKey = order.status.toLowerCase();
  const statusStyle = STATUS_STYLES[statusKey] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="border border-gray-200 bg-white group hover:border-black transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
            <PackageIcon className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1">
              Order ID
            </p>
            <p className="font-black text-sm uppercase tracking-tight">
              #{order.id.slice(-8).toUpperCase()}
            </p>
          </div>
          <span
            className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 ${statusStyle}`}
          >
            {order.status}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-gray-500 font-medium">
          <CalendarIcon className="w-3.5 h-3.5" />
          {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-gray-100">
        {order.orderItems.map((item) => (
          <div key={item.id} className="px-6 py-4 flex gap-4 items-center">
            <div className="relative w-16 h-16 shrink-0 bg-gray-50 border border-gray-100 overflow-hidden">
              {item.product.images[0]?.src ? (
                <Image
                  src={item.product.images[0].src}
                  alt={item.product.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-gray-400 uppercase">
                  No Img
                </div>
              )}
            </div>
            <div className="flex flex-1 justify-between items-center gap-4 min-w-0">
              <div className="min-w-0">
                <h4 className="font-bold text-sm uppercase tracking-tight leading-tight line-clamp-1">
                  {item.product.name}
                </h4>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Qty: {item.quantity}
                </p>
              </div>
              <p className="font-black text-sm tabular-nums shrink-0">
                {formatRupiah(item.product.price.toString())}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1">
            Total Amount
          </p>
          <p className="text-xl font-black tabular-nums tracking-tight">
            {formatRupiah(order.totalAmount)}
          </p>
        </div>
        <Button
          asChild
          className="h-9 px-6 text-xs font-bold uppercase tracking-widest rounded-none bg-black hover:bg-gray-800 text-white transition-colors"
        >
          <Link
            href={`/profile/order/${order.id}`}
            className="flex items-center gap-2"
          >
            View Details
            <ChevronRightIcon className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
