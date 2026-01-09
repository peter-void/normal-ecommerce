"use client";

import { getAdminOrders } from "@/app/(admin)/admin/orders/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { OrderStatusBadge } from "@/features/orders/components/order-status-badge";
import { UpdateStatusDropdown } from "@/features/orders/components/update-status-dropdown";
import type {
  Address,
  Order,
  OrderItem,
  Product,
  User,
} from "@/generated/prisma/client";
import { OrderStatus } from "@/generated/prisma/enums";
import { cn, formatCurrency } from "@/lib/utils";
import { format } from "date-fns";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  MapPin,
  Package,
  Search,
  Truck,
  User as UserIcon,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

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
      } = await getAdminOrders({
        page,
        limit: 10,
        search: debouncedSearch,
      });
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
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          description="All-time earnings"
          icon={<Wallet className="size-6" />}
          color="bg-blue-400"
        />
        <StatCard
          title="Pending Orders"
          value={stats.pending.toString()}
          description="Awaiting processing"
          icon={<Clock className="size-6" />}
          color="bg-orange-400"
        />

        <StatCard
          title="Completed"
          value={stats.delivered.toString()}
          description="Orders delivered"
          icon={<Package className="size-6" />}
          color="bg-yellow-400"
        />
      </div>

      <div className="space-y-8">
        <div className="flex flex-col md:flex-row items-stretch gap-6">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-black/50" />
            <Input
              placeholder="Search by order id, customer, or items..."
              value={search}
              onChange={handleSearch}
              className="pl-12 h-14 text-lg bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 placeholder:text-black/30 font-bold"
            />
          </div>
          <button className="flex items-center gap-3 px-8 py-3 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-wider text-sm whitespace-nowrap hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
            <Package className="size-6" />
            <span>{metadata.totalOrders} Orders</span>
          </button>
        </div>

        <div className="space-y-10">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <div className="p-6 border-b-4 border-black bg-[#F3F4F6] flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="px-3 py-1 bg-black text-white text-xs font-black uppercase tracking-widest">
                      ORDER
                    </span>
                    <h3 className="text-2xl font-black tracking-tighter">
                      #{order.id.slice(-8).toUpperCase()}
                    </h3>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <div className="flex items-center gap-6 text-sm font-bold uppercase tracking-tight">
                    <div className="flex items-center gap-2 text-black/60">
                      <div className="size-8 rounded-full bg-white border-2 border-black flex items-center justify-center overflow-hidden">
                        <UserIcon className="size-4" />
                      </div>
                      <span>{order.user.name}</span>
                    </div>
                    <div className="hidden sm:block w-1.5 h-1.5 rounded-full bg-black/20" />
                    <div className="flex items-center gap-2 text-black/40 font-mono">
                      <Clock className="size-4" />
                      <span>
                        {format(new Date(order.createdAt), "MMM dd, HH:mm")}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end md:self-center">
                  <UpdateStatusDropdown
                    orderId={order.id}
                    currentStatus={order.status}
                    onStatusUpdate={(newStatus) =>
                      handleStatusUpdate(order.id, newStatus)
                    }
                  />
                </div>
              </div>

              <div className="grid lg:grid-cols-12">
                <div className="lg:col-span-8 p-6 lg:border-r-4 border-black bg-white">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="text-sm font-black uppercase tracking-[0.2em] flex items-center gap-2">
                      <Package className="size-5" /> Items
                    </h4>
                    <span className="text-xs font-black px-2 py-0.5 border-2 border-black">
                      {order.orderItems.length} ITEMS
                    </span>
                  </div>
                  <div className="space-y-4">
                    {order.orderItems.map((item) => (
                      <div
                        key={item.id}
                        className="group flex flex-col sm:flex-row items-stretch sm:items-center gap-6 p-4 border-4 border-black bg-white hover:bg-zinc-50 transition-colors"
                      >
                        <div className="size-24 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative shrink-0 overflow-hidden transform group-hover:-rotate-2 transition-transform">
                          {item.product.images?.[0] ? (
                            <Image
                              src={item.product.images[0].src}
                              alt={item.product.name}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center size-full bg-zinc-100">
                              <Package className="size-10 text-black/10" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
                          <div>
                            <h5 className="font-black text-lg leading-tight uppercase mb-1">
                              {item.product.name}
                            </h5>
                            <p className="text-sm font-bold text-black/40">
                              QTY:{" "}
                              <span className="text-black">
                                {item.quantity}
                              </span>
                            </p>
                          </div>
                          <div className="text-left sm:text-right flex sm:flex-col justify-between sm:justify-center">
                            <p className="text-xl font-black italic">
                              {formatCurrency(Number(item.product.price))}
                            </p>
                            <p className="text-[10px] font-black text-black/30 uppercase tracking-widest">
                              PER UNIT
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="lg:col-span-4 flex flex-col">
                  <div className="p-6 border-b-4 border-black bg-[#E0F2FE]">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        <MapPin className="size-4" />
                      </div>
                      <h4 className="text-sm font-black uppercase tracking-widest">
                        Ship to
                      </h4>
                    </div>
                    <div className="space-y-2">
                      <p className="font-black text-lg">
                        {order.address.receiverName}
                      </p>
                      <p className="text-sm font-bold leading-tight text-black/70">
                        {order.address.completeAddress}, {order.address.city},{" "}
                        {order.address.province} {order.address.postalCode}
                      </p>
                      <p className="text-xs font-black pt-2 flex items-center gap-2">
                        <span className="opacity-40 font-mono tracking-tighter">
                          PH:
                        </span>
                        {order.address.phoneNumber}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 bg-white flex-1 flex flex-col justify-between space-y-8">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 font-black text-xs uppercase tracking-widest">
                          <CreditCard className="size-4" /> Payment
                        </div>
                        <span className="px-3 py-1 bg-emerald-400 border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          {order.paymentMethod || "COD"}
                        </span>
                      </div>
                      <div className="p-4 bg-zinc-50 border-4 border-black border-dashed">
                        <div className="flex items-center justify-between text-black/40 font-bold text-xs">
                          <span>SUBTOTAL</span>
                          <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                        <div className="flex items-center justify-between text-black/40 font-bold text-xs mt-1">
                          <span>SHIPPING</span>
                          <span>FREE</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 group">
                      <p className="text-[10px] font-black text-black/30 uppercase tracking-[0.3em] mb-1">
                        Grand Total
                      </p>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black italic tracking-tighter transform group-hover:scale-105 transition-transform origin-left">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {orders.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center bg-white border-4 border-black border-dashed">
              <div className="size-24 bg-zinc-100 border-4 border-black flex items-center justify-center mb-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <Package className="size-12 text-black/10" />
              </div>
              <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">
                No Orders Found
              </h3>
              <p className="text-sm font-bold text-black/40 uppercase tracking-widest">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10">
          <Button
            variant="outline"
            onClick={() => handlePageChange(page - 1)}
            disabled={page <= 1 || isPending}
            className="h-14 px-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase tracking-widest text-sm bg-white"
          >
            <ChevronLeft className="mr-2 size-5" /> PREV
          </Button>

          <div className="px-8 py-3 bg-black text-white font-black text-sm tracking-[0.2em]">
            PAGE {page} / {metadata.totalPages || 1}
          </div>

          <Button
            variant="outline"
            onClick={() => handlePageChange(page + 1)}
            disabled={!metadata.hasNextPage || isPending}
            className="h-14 px-8 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all font-black uppercase tracking-widest text-sm bg-white"
          >
            NEXT <ChevronRight className="ml-2 size-5" />
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon,
  color,
}: {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <Card className="relative overflow-hidden border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
              {title}
            </p>
            <p className="text-4xl font-black tracking-tighter text-black">
              {value}
            </p>
          </div>
          <div
            className={cn(
              "p-3 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
              color
            )}
          >
            {icon}
          </div>
        </div>
        <div className="flex items-center gap-2 pt-4 border-t-2 border-black/5">
          <div className="size-2 rounded-full bg-black animate-pulse" />
          <p className="text-[10px] font-black uppercase tracking-widest text-black/60">
            Real-time update
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
