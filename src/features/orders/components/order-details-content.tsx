"use client";
import { useState } from "react";

import { OrderWithItems } from "@/app/(consumer)/profile/order/[id]/page";
import { Button } from "@/components/ui/button";
import { formatRupiah } from "@/lib/format";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowLeft,
  CalendarIcon,
  CheckCircle2Icon,
  CircleDotIcon,
  CreditCardIcon,
  HashIcon,
  MapPinIcon,
  PackageIcon,
  TruckIcon,
  XCircleIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface OrderDetailsContentProps {
  order: OrderWithItems;
}

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-black text-white",
  completed: "bg-black text-white",
  pending: "bg-gray-200 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
  failed: "bg-red-100 text-red-700",
};

// The normal progression steps
const TIMELINE_STEPS = [
  {
    key: "PENDING",
    label: "Order Placed",
    description: "Your order has been received and is awaiting payment.",
    icon: PackageIcon,
  },
  {
    key: "PAID",
    label: "Payment Confirmed",
    description: "Payment verified. Your order is being prepared.",
    icon: CreditCardIcon,
  },
  {
    key: "SHIPPED",
    label: "Shipped",
    description: "Your order is on the way to your address.",
    icon: TruckIcon,
  },
  {
    key: "DELIVERED",
    label: "Delivered",
    description: "Your order has been delivered successfully.",
    icon: CheckCircle2Icon,
  },
];

const STATUS_ORDER_INDEX: Record<string, number> = {
  PENDING: 0,
  PAID: 1,
  SHIPPED: 2,
  DELIVERED: 3,
  CANCELLED: -1,
  EXPIRED: -1,
};

function OrderTimeline({ status }: { status: string }) {
  const currentIndex = STATUS_ORDER_INDEX[status.toUpperCase()] ?? 0;
  const isCancelledOrExpired = status === "CANCELLED" || status === "EXPIRED";

  if (isCancelledOrExpired) {
    return (
      <div className="border border-red-100 bg-red-50 px-6 py-5 flex items-center gap-4">
        <XCircleIcon className="w-8 h-8 text-red-400 shrink-0" />
        <div>
          <p className="font-black text-sm uppercase tracking-widest text-red-700">
            Order {status.charAt(0) + status.slice(1).toLowerCase()}
          </p>
          <p className="text-xs text-red-500 mt-0.5">
            {status === "CANCELLED"
              ? "This order was cancelled."
              : "This order has expired due to non-payment."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-gray-200 px-6 py-6">
      <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-6">
        Order Progress
      </p>
      <div className="flex items-start gap-0">
        {TIMELINE_STEPS.map((step, index) => {
          const Icon = step.icon;
          const isCompleted = index < currentIndex;
          const isCurrent = index === currentIndex;
          const isUpcoming = index > currentIndex;
          const isLast = index === TIMELINE_STEPS.length - 1;

          return (
            <div key={step.key} className="flex-1 flex flex-col items-center">
              {/* Connector line + circle row */}
              <div className="flex items-center w-full">
                {/* Left line */}
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    index === 0 ? "invisible" : "",
                    isCompleted || isCurrent ? "bg-black" : "bg-gray-200",
                  )}
                />
                {/* Icon circle */}
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
                    isCompleted
                      ? "bg-black border-black text-white"
                      : isCurrent
                        ? "bg-white border-black text-black"
                        : "bg-white border-gray-200 text-gray-300",
                  )}
                >
                  {isCurrent ? (
                    <CircleDotIcon className="w-4 h-4" />
                  ) : (
                    <Icon className="w-4 h-4" />
                  )}
                </div>
                {/* Right line */}
                <div
                  className={cn(
                    "h-0.5 flex-1",
                    isLast ? "invisible" : "",
                    isCompleted ? "bg-black" : "bg-gray-200",
                  )}
                />
              </div>

              {/* Label below */}
              <div className="mt-3 text-center px-1">
                <p
                  className={cn(
                    "text-[10px] font-black uppercase tracking-wide leading-tight",
                    isCompleted || isCurrent ? "text-black" : "text-gray-300",
                  )}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <p className="text-[10px] text-gray-500 mt-1 leading-snug hidden sm:block">
                    {step.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function OrderDetailsContent({ order }: OrderDetailsContentProps) {
  const [isAddressExpanded, setIsAddressExpanded] = useState(false);

  const statusKey = order.status.toLowerCase();
  const statusStyle = STATUS_STYLES[statusKey] ?? "bg-gray-100 text-gray-600";
  const paymentStatusKey = (order.paymentStatus ?? "pending").toLowerCase();
  const paymentStatusStyle =
    STATUS_STYLES[paymentStatusKey] ?? "bg-gray-100 text-gray-600";

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Back + Title */}
      <div className="flex items-center gap-4">
        <Button
          size="icon"
          variant="outline"
          className="border border-gray-200 hover:border-black rounded-none transition-colors"
          asChild
        >
          <Link href="/profile/order">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-black uppercase tracking-tight">
            Order Details
          </h1>
          <p className="text-xs text-gray-500 font-medium mt-0.5">
            #{order.id.slice(-8).toUpperCase()}
          </p>
        </div>
      </div>

      {/* Status Timeline */}
      <OrderTimeline status={order.status} />

      {/* Order Header Card */}
      <div className="border border-gray-200">
        <div className="px-6 py-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap items-center gap-3">
            <div className="w-10 h-10 bg-black flex items-center justify-center shrink-0">
              <PackageIcon className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-0.5">
                Order Reference
              </p>
              <p className="font-black text-base uppercase tracking-tight">
                #{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
            <span
              className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 ${statusStyle}`}
            >
              {order.status}
            </span>
          </div>
          <div className="text-right">
            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1">
              Total Bill
            </p>
            <p className="text-2xl font-black tabular-nums tracking-tight">
              {formatRupiah(order.totalAmount)}
            </p>
          </div>
        </div>

        {/* Meta Info */}
        <div className="px-6 py-4 flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none">
                Placed On
              </p>
              <p className="text-sm font-bold">
                {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none">
                Last Updated
              </p>
              <p className="text-sm font-bold">
                {format(new Date(order.updatedAt), "dd MMM yyyy, HH:mm")}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <HashIcon className="w-4 h-4 text-gray-400" />
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none">
                Full Reference
              </p>
              <p className="text-xs font-bold text-gray-600 break-all max-w-xs">
                {order.id}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Items Ordered */}
      <div className="border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
          <PackageIcon className="w-4 h-4 text-gray-500" />
          <h3 className="text-sm font-black uppercase tracking-widest">
            Items Ordered
          </h3>
          <span className="text-xs font-bold text-gray-400">
            ({order.orderItems.length})
          </span>
        </div>
        <div className="divide-y divide-gray-100">
          {order.orderItems.map((item) => (
            <div
              key={item.id}
              className="px-6 py-5 flex flex-col sm:flex-row gap-4"
            >
              <div className="relative w-full sm:w-20 aspect-square sm:aspect-auto sm:h-20 shrink-0 bg-gray-50 border border-gray-100 overflow-hidden">
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
              <div className="flex flex-1 flex-col sm:flex-row sm:justify-between sm:items-start gap-2 py-1 min-w-0">
                <div className="min-w-0">
                  <h4 className="font-black text-base uppercase tracking-tight leading-tight line-clamp-2">
                    {item.product.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-black uppercase tracking-widest bg-gray-100 text-gray-600 px-2 py-1">
                      {item.product.category?.name || "General"}
                    </span>
                    <span className="text-xs font-bold text-gray-500">
                      Qty: {item.quantity}
                    </span>
                  </div>
                </div>
                <p className="font-black text-base tabular-nums shrink-0">
                  {formatRupiah(item.product.price.toString())}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping + Payment */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Info */}
        <div className="border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <TruckIcon className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">
              Shipping Info
            </h3>
          </div>
          <div className="px-6 py-5 space-y-5">
            {order.address ? (
              <>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1.5">
                    Receiver
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center shrink-0">
                      <MapPinIcon className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-bold text-sm uppercase tracking-tight">
                        {order.address.receiverName}
                      </p>
                      <p className="text-xs text-gray-500 font-medium">
                        {order.address.phoneNumber}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1.5">
                    Address Label
                  </p>
                  <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2.5 py-1">
                    {order.address.label}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-1.5">
                    Full Address
                  </p>
                  <div className="bg-gray-50 border border-gray-100 p-4">
                    <p
                      className={cn(
                        "text-sm font-medium leading-relaxed text-gray-700 transition-all duration-300",
                        !isAddressExpanded && "line-clamp-3",
                      )}
                    >
                      {order.address.completeAddress}
                      <br />
                      {order.address.subdistrict}, {order.address.city}
                      <br />
                      {order.address.province}, {order.address.postalCode}
                    </p>
                    <button
                      onClick={() => setIsAddressExpanded(!isAddressExpanded)}
                      className="mt-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black underline underline-offset-2 transition-colors"
                    >
                      {isAddressExpanded ? "Show Less" : "Show More"}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <MapPinIcon className="w-8 h-8 text-gray-300 mb-3" />
                <p className="font-bold uppercase text-sm text-gray-500">
                  No Address Found
                </p>
                <p className="text-xs text-gray-400 mt-1 max-w-xs">
                  Please set a main address in your profile settings.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Details */}
        <div className="border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 flex items-center gap-3">
            <CreditCardIcon className="w-4 h-4 text-gray-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">
              Payment Details
            </h3>
          </div>
          <div className="px-6 py-5 space-y-4">
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Payment Method
              </p>
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-2.5 py-1">
                {order.paymentMethod || "Not Selected"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                Payment Status
              </p>
              <span
                className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 ${paymentStatusStyle}`}
              >
                {order.paymentStatus || "Pending"}
              </span>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500">
                  Total Amount Paid
                </p>
                <p className="text-xl font-black tabular-nums tracking-tight">
                  {formatRupiah(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
