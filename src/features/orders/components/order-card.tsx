"use client";

import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderWithItems } from "./order-list";
import Link from "next/link";

interface OrderCardProps {
  order: OrderWithItems;
}

export function OrderCard({ order }: OrderCardProps) {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "paid":
      case "completed":
        return "bg-green-400 text-black border-black";
      case "pending":
        return "bg-yellow-300 text-black border-black";
      case "cancelled":
      case "failed":
        return "bg-red-400 text-black border-black";
      default:
        return "bg-gray-200 text-black border-black";
    }
  };

  return (
    <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden bg-white hover:translate-y-[-2px] hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] transition-all duration-200">
      <div className="relative border-b-4 border-black bg-yellow-400 overflow-hidden">
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
            backgroundSize: "16px 16px",
          }}
        />

        <div className="relative p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10">
          <div className="space-y-2">
            <div className="flex items-start gap-4">
              <div className="bg-black text-white px-3 py-1 font-black text-xl sm:text-2xl uppercase italic tracking-tighter shadow-[-4px_4px_0px_0px_rgba(255,255,255,1)] transform -rotate-2">
                #{order.id.slice(-6)}
              </div>
              <Badge
                className={cn(
                  "mt-1 rounded-sm border-2 px-2 py-0.5 font-bold text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                  getStatusColor(order.status)
                )}
              >
                {order.status}
              </Badge>
            </div>
            <div>
              <p className="text-xs font-bold uppercase text-black/80">
                Ordered On
              </p>
              <p className="text-base font-black text-black">
                {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
              </p>
            </div>
          </div>

          <div className="text-right hidden sm:block bg-white border-2 border-black p-2 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <p className="text-[10px] font-bold uppercase text-muted-foreground leading-none mb-1">
              Total Amount
            </p>
            <p className="text-xl font-black tabular-nums tracking-tighter leading-none">
              {formatRupiah(order.totalAmount)}
            </p>
          </div>
        </div>
      </div>

      <div className="divide-y-4 divide-black">
        {order.orderItems.map((item) => (
          <div
            key={item.id}
            className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 group"
          >
            <div className="relative aspect-square w-20 sm:w-24 shrink-0 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
              {item.product.images[0]?.src ? (
                <Image
                  src={item.product.images[0].src}
                  alt={item.product.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center font-bold text-xs">
                  NO IMG
                </div>
              )}
            </div>

            <div className="flex flex-1 flex-col justify- between">
              <div className="flex justify-between items-start gap-4">
                <h4 className="font-bold text-lg leading-tight uppercase line-clamp-2">
                  {item.product.name}
                </h4>
                <p className="font-bold tabular-nums shrink-0">
                  {formatRupiah(item.product.price.toString())}
                </p>
              </div>
              <div className="mt-2 flex items-center gap-2 text-sm font-bold text-muted-foreground">
                <span className="bg-black text-white px-2 py-0.5 rounded-sm">
                  x{item.quantity}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sm:hidden border-t-4 border-black p-4 bg-gray-50 flex justify-between items-center">
        <p className="font-bold uppercase">Total</p>
        <p className="text-xl font-black tabular-nums">
          {formatRupiah(order.totalAmount)}
        </p>
      </div>

      <div className="border-t-4 border-black p-4 sm:p-6 bg-white flex justify-end gap-4">
        <Button
          variant="neutral"
          className="w-full sm:w-auto font-bold uppercase"
        >
          Track Order
        </Button>
        <Button
          className="w-full sm:w-auto font-bold uppercase bg-main text-main-foreground hover:bg-main/90"
          asChild
        >
          <Link href={`/profile/order/${order.id}`}>View Details</Link>
        </Button>
      </div>
    </Card>
  );
}
