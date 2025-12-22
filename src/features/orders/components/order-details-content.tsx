"use client";
import React, { useState } from "react";

import { OrderWithItems } from "@/app/(consumer)/profile/order/[id]/page";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  Hash,
  MapPin,
  Package,
  Truck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderDetailsContentProps {
  order: OrderWithItems;
}

export function OrderDetailsContent({ order }: OrderDetailsContentProps) {
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);

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
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div className="flex items-center gap-4">
        <Button
          variant="neutral"
          size="icon"
          className="border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
          asChild
        >
          <Link href="/profile/order">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </Button>
        <h1 className="text-4xl font-black uppercase italic tracking-tighter">
          Order Details
        </h1>
      </div>

      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden bg-white">
        <div className="relative border-b-4 border-black bg-yellow-400 overflow-hidden">
          <div
            className="absolute inset-0 opacity-20 pointer-events-none"
            style={{
              backgroundImage: "radial-gradient(#000 2px, transparent 2px)",
              backgroundSize: "16px 16px",
            }}
          />
          <div className="relative p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4">
                <div className="bg-black text-white px-4 py-2 font-black text-2xl md:text-3xl uppercase italic tracking-tighter shadow-[-4px_4px_0px_0px_rgba(255,255,255,1)] transform -rotate-1">
                  #{order.id.slice(-6).toUpperCase()}
                </div>
                <Badge
                  className={cn(
                    "rounded-sm border-2 px-4 py-1.5 font-bold text-sm uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
                    getStatusColor(order.status)
                  )}
                >
                  {order.status}
                </Badge>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-black/60 leading-none">
                      Placed On
                    </p>
                    <p className="text-base font-black">
                      {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Hash className="w-5 h-5" />
                  <div>
                    <p className="text-[10px] font-bold uppercase text-black/60 leading-none">
                      Full Reference
                    </p>
                    <p className="text-sm font-black break-all">{order.id}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white border-2 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] self-start md:self-center">
              <p className="text-xs font-bold uppercase text-muted-foreground mb-1">
                Total Bill
              </p>
              <p className="text-2xl md:text-3xl font-black tabular-nums tracking-tighter">
                {formatRupiah(order.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* Items Section */}
        <div className="p-6 sm:p-8 space-y-6">
          <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
            <Package className="w-6 h-6" /> Items Ordered
          </h3>
          <div className="grid gap-4">
            {order.orderItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col sm:flex-row gap-4 p-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <div className="relative aspect-square w-full sm:w-24 shrink-0 border-2 border-black bg-gray-50 overflow-hidden">
                  {item.product.images[0]?.src ? (
                    <Image
                      src={item.product.images[0].src}
                      alt={item.product.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-xs uppercase">
                      No Img
                    </div>
                  )}
                </div>
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div className="flex flex-col sm:flex-row sm:justify-between items-start gap-2">
                    <h4 className="font-black text-lg md:text-xl uppercase leading-tight">
                      {item.product.name}
                      <span className="ml-2 inline-block bg-black text-white px-2 py-0.25 text-sm transform rotate-2">
                        x{item.quantity}
                      </span>
                    </h4>
                    <p className="font-black text-lg tabular-nums">
                      {formatRupiah(item.product.price.toString())}
                    </p>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge className="border-black border-2 font-bold uppercase text-[10px]">
                      {item.product.category?.name || "General"}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 border-t-4 border-black">
          <div className="p-6 sm:p-8 border-b-4 md:border-b-0 md:border-r-4 border-black space-y-6 bg-purple-100">
            <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
              <Truck className="w-6 h-6" /> Shipping Info
            </h3>
            <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex gap-3">
                <MapPin className="w-5 h-5 shrink-0 mt-1" />
                <div className="space-y-3">
                  {order.user.addresses[0] ? (
                    <>
                      <div>
                        <p className="font-black uppercase text-xs text-black/60 leading-none mb-1">
                          Receiver
                        </p>
                        <p className="font-bold text-sm uppercase">
                          {order.user.addresses[0].receiverName}
                        </p>
                        <p className="text-xs font-bold text-black/60">
                          {order.user.addresses[0].phoneNumber}
                        </p>
                      </div>
                      <div>
                        <p className="font-black uppercase text-xs text-black/60 leading-none mb-1">
                          Address Label
                        </p>
                        <Badge className="bg-black text-white text-[10px] font-black uppercase rounded-sm px-1.5 py-0">
                          {order.user.addresses[0].label}
                        </Badge>
                      </div>
                      <div>
                        <p className="font-black uppercase text-xs text-black/60 leading-none mb-1">
                          Full Address
                        </p>
                        <div className="relative">
                          <p
                            className={cn(
                              "text-sm font-medium leading-relaxed transition-all duration-300",
                              !isAddressExpanded && "line-clamp-3"
                            )}
                          >
                            {order.user.addresses[0].completeAddress}
                            <br />
                            {order.user.addresses[0].subdistrict},{" "}
                            {order.user.addresses[0].city}
                            <br />
                            {order.user.addresses[0].province},{" "}
                            {order.user.addresses[0].postalCode}
                          </p>
                          <button
                            onClick={() =>
                              setIsAddressExpanded(!isAddressExpanded)
                            }
                            className="mt-2 text-[10px] font-black uppercase underline decoration-2 underline-offset-2 hover:bg-black hover:text-white px-1 transition-colors"
                          >
                            {isAddressExpanded ? "Show Less" : "Show More"}
                          </button>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div>
                      <p className="font-black uppercase text-sm">
                        No Main Address Found
                      </p>
                      <p className="text-xs text-black/60 italic font-bold uppercase mt-2 leading-relaxed">
                        Please set a main address in your profile settings to
                        see shipping details for future orders.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6 bg-cyan-100">
            <h3 className="text-xl font-black uppercase italic flex items-center gap-2">
              <CreditCard className="w-6 h-6" /> Payment Details
            </h3>
            <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] space-y-4">
              <div className="flex justify-between items-center">
                <p className="font-bold uppercase text-sm">Payment Method</p>
                <Badge className="bg-black text-white uppercase font-black">
                  {order.paymentMethod || "Not Selected"}
                </Badge>
              </div>
              <div className="flex justify-between items-center">
                <p className="font-bold uppercase text-sm">Payment Status</p>
                <Badge
                  className={cn(
                    "uppercase font-black",
                    getStatusColor(order.paymentStatus || "PENDING")
                  )}
                >
                  {order.paymentStatus || "PENDING"}
                </Badge>
              </div>
              <div className="pt-4 border-t-2 border-black border-dashed">
                <div className="flex justify-between items-center font-black">
                  <p className="uppercase">Total Amount Paid</p>
                  <p className="text-xl tabular-nums">
                    {formatRupiah(order.totalAmount)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="flex justify-center">
        <Button
          variant="default"
          className="bg-black text-white hover:bg-black/80 font-black uppercase px-8 py-6 text-lg border-2 border-black shadow-[6px_6px_0px_0px_rgba(100,100,100,1)] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all"
        >
          Download Invoice
        </Button>
      </div>
    </div>
  );
}
