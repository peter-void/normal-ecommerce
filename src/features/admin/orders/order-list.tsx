"use client";

import { getAdminOrders } from "@/app/(admin)/admin/orders/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UpdateStatusDropdown } from "@/features/orders/components/update-status-dropdown";
import type {
  Address,
  Order,
  OrderItem,
  Product,
  User,
} from "@/generated/prisma/client";
import { OrderStatus } from "@/generated/prisma/enums";
import { formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Search,
  Wallet,
  User as UserIcon,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";

type OrderWithRelations = Order & {
  user: User;
  address: Address;
  orderItems: (OrderItem & { product: Product & { images?: any[] } })[];
};

interface Stats {
  totalRevenue: number;
  pending: number;
  shipped: number;
  delivered: number;
}

const STATUS_STYLES: Record<string, string> = {
  DELIVERED: "bg-black text-white",
  PAID: "bg-gray-800 text-white",
  SHIPPED: "bg-gray-600 text-white",
  PENDING: "bg-gray-100 text-gray-700",
  CANCELLED: "bg-gray-200 text-gray-500",
  EXPIRED: "bg-gray-100 text-gray-400",
};

export function OrderList({
  initialOrders,
  initialMetadata,
  initialStats,
}: {
  initialOrders: OrderWithRelations[];
  initialMetadata: {
    hasNextPage: boolean;
    totalPages: number;
    totalOrders: number;
  };
  initialStats: Stats;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [orders, setOrders] = useState<OrderWithRelations[]>(initialOrders);
  const [metadata, setMetadata] = useState(initialMetadata);
  const [stats, setStats] = useState(initialStats);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(Number(searchParams.get("page")) || 1);
  const [isPending, startTransition] = useTransition();
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    startTransition(async () => {
      const {
        orders: newOrders,
        metadata: newMetadata,
        stats: newStats,
      } = await getAdminOrders({ page, limit: 10, search: debouncedSearch });
      setOrders(newOrders as any);
      setMetadata(newMetadata);
      if (newStats) setStats(newStats as Stats);
    });
  }, [page, debouncedSearch]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    const params = new URLSearchParams(searchParams);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleStatusUpdate = (orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)),
    );
  };

  return (
    <div className="space-y-8">
      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          {
            label: "Total Revenue",
            value: formatCurrency(stats.totalRevenue),
            icon: <Wallet className="h-4 w-4" />,
          },
          {
            label: "Pending",
            value: stats.pending.toString(),
            icon: <Clock className="h-4 w-4" />,
          },
          {
            label: "Delivered",
            value: stats.delivered.toString(),
            icon: <Package className="h-4 w-4" />,
          },
        ].map((s, i) => (
          <div key={i} className="border border-gray-200 bg-white p-5">
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              {s.icon}
              <span className="text-xs font-bold uppercase tracking-widest">
                {s.label}
              </span>
            </div>
            <p className="text-2xl font-black tracking-tight">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search + count */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by order ID, customer, or product..."
            value={search}
            onChange={handleSearch}
            className="pl-10 h-10 border border-gray-300 rounded-none focus-visible:ring-0 focus-visible:border-black text-sm bg-white"
          />
        </div>
        <div className="shrink-0 px-4 py-2 border border-gray-200 text-xs font-bold uppercase tracking-widest text-gray-500 bg-white">
          {metadata.totalOrders} orders
        </div>
      </div>

      {/* Order cards */}
      <div
        className={cn(
          "space-y-4",
          isPending && "opacity-60 pointer-events-none",
        )}
      >
        {orders.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-3 border border-dashed border-gray-300">
            <Package className="h-10 w-10 text-gray-300" />
            <p className="text-sm font-bold uppercase tracking-widest text-gray-400">
              No orders found
            </p>
            {search && (
              <p className="text-xs text-gray-400">
                Try a different search term
              </p>
            )}
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="border border-gray-200 bg-white overflow-hidden"
            >
              {/* Order header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Order
                  </span>
                  <span className="font-black text-lg tracking-tight">
                    #{order.id.slice(-8).toUpperCase()}
                  </span>
                  <span
                    className={cn(
                      "px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest",
                      STATUS_STYLES[order.status] ??
                        "bg-gray-100 text-gray-600",
                    )}
                  >
                    {order.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1.5">
                    <UserIcon className="h-3.5 w-3.5" />
                    <span className="font-bold">{order.user.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span className="font-mono">
                      {format(new Date(order.createdAt), "MMM dd, HH:mm")}
                    </span>
                  </div>
                  <UpdateStatusDropdown
                    orderId={order.id}
                    currentStatus={order.status}
                    onStatusUpdate={(s) => handleStatusUpdate(order.id, s)}
                  />
                </div>
              </div>

              {/* Body */}
              <div className="grid lg:grid-cols-12">
                {/* Items */}
                <div className="lg:col-span-8 p-5 lg:border-r border-gray-100">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                      <Package className="h-3.5 w-3.5" /> Items
                    </span>
                    <span className="text-xs font-bold text-gray-400">
                      {order.orderItems.length} item
                      {order.orderItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <div className="space-y-3">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="flex items-center gap-4 py-3 border-b border-gray-50 last:border-0"
                      >
                        <div className="h-14 w-14 border border-gray-100 bg-gray-50 overflow-hidden relative shrink-0">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0].src}
                              alt={item.product.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <Package className="h-6 w-6 text-gray-300" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-gray-400">
                            Qty: {item.quantity}
                          </p>
                        </div>
                        <p className="font-black text-sm shrink-0">
                          {formatCurrency(Number(item.product.price))}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sidebar: address + payment */}
                <div className="lg:col-span-4 flex flex-col divide-y divide-gray-100">
                  {/* Shipping */}
                  <div className="p-5">
                    <p className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5 mb-3">
                      <MapPin className="h-3.5 w-3.5" /> Ship to
                    </p>
                    <p className="font-bold text-sm">
                      {order.address.receiverName}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {order.address.completeAddress}, {order.address.city},{" "}
                      {order.address.province} {order.address.postalCode}
                    </p>
                    <p className="text-xs text-gray-400 mt-2 font-mono">
                      {order.address.phoneNumber}
                    </p>
                  </div>

                  {/* Payment + total */}
                  <div className="p-5 flex flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                        <CreditCard className="h-3.5 w-3.5" /> Payment
                      </p>
                      <span className="text-xs font-bold uppercase tracking-widest bg-gray-100 px-2 py-0.5 text-gray-700">
                        {order.paymentMethod || "COD"}
                      </span>
                    </div>
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-gray-400 uppercase tracking-widest mb-0.5">
                        Total
                      </p>
                      <p className="text-xl font-black tracking-tight">
                        {formatCurrency(order.totalAmount)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      {metadata.totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isPending}
            className="h-9 px-4 border border-gray-300 rounded-none hover:bg-black hover:text-white hover:border-black transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Prev
          </Button>
          <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">
            {page} / {metadata.totalPages || 1}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(page + 1)}
            disabled={!metadata.hasNextPage || isPending}
            className="h-9 px-4 border border-gray-300 rounded-none hover:bg-black hover:text-white hover:border-black transition-colors font-bold text-xs uppercase tracking-widest"
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
