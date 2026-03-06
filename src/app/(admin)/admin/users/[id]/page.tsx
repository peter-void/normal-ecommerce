import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { formatRupiah } from "@/lib/format";
import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Mail,
  Package,
  ShieldAlert,
  ShieldCheck,
  User,
  Wallet,
} from "lucide-react";
import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

export default async function UserDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.isAdmin) {
    redirect("/");
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      orders: {
        orderBy: { createdAt: "desc" },
        take: 5,
      },
      _count: {
        select: { orders: true },
      },
    },
  });

  if (!user) {
    notFound();
  }

  const totalSpent = user.orders.reduce(
    (acc, order) => acc + Number(order.totalAmount),
    0,
  );

  const tenureMonths = Math.floor(
    (Date.now() - new Date(user.createdAt).getTime()) /
      (1000 * 60 * 60 * 24 * 30),
  );

  const statusColors: Record<string, string> = {
    DELIVERED: "bg-black text-white",
    PAID: "bg-gray-800 text-white",
    SHIPPED: "bg-gray-600 text-white",
    CANCELLED: "bg-gray-200 text-gray-700",
    PENDING: "bg-gray-100 text-gray-700",
    EXPIRED: "bg-gray-100 text-gray-500",
  };

  return (
    <div className="min-h-screen bg-white p-4 md:p-8 lg:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4 pb-6 border-b border-gray-200">
          <Link href="/admin/users">
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10 border border-gray-300 bg-white rounded-none hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-gray-400">
              Admin / Users
            </p>
            <h1 className="text-3xl font-black uppercase tracking-tight leading-none">
              User Details
            </h1>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left — Profile Card */}
          <div className="lg:col-span-4">
            <div className="border border-gray-200 bg-white">
              {/* Avatar */}
              <div className="p-8 flex flex-col items-center gap-4">
                <div className="relative">
                  <div className="h-28 w-28 border border-gray-200 overflow-hidden bg-gray-100">
                    {user.image ? (
                      <Image
                        src={user.image}
                        alt={user.name}
                        fill
                        unoptimized
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center font-black text-5xl text-gray-400 bg-gray-50">
                        {user.name.charAt(0)}
                      </div>
                    )}
                  </div>
                  {/* Verified badge */}
                  <div
                    className={cn(
                      "absolute -bottom-2 -right-2 h-8 w-8 border border-gray-200 flex items-center justify-center",
                      user.emailVerified ? "bg-black" : "bg-gray-300",
                    )}
                  >
                    {user.emailVerified ? (
                      <CheckCircle2 className="h-4 w-4 text-white" />
                    ) : (
                      <ShieldAlert className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>

                {/* Name & email */}
                <div className="text-center space-y-1">
                  <h2 className="text-2xl font-black tracking-tight uppercase">
                    {user.name}
                  </h2>
                  <div className="flex items-center justify-center gap-1.5 text-sm text-gray-500">
                    <Mail className="h-3.5 w-3.5" />
                    <span className="truncate max-w-[200px]">{user.email}</span>
                  </div>
                </div>

                {/* Role badge */}
                <div
                  className={cn(
                    "w-full flex items-center justify-center gap-2 py-2.5 border border-gray-200 text-sm font-bold uppercase tracking-widest",
                    user.isAdmin
                      ? "bg-black text-white"
                      : "bg-gray-50 text-gray-700",
                  )}
                >
                  {user.isAdmin ? (
                    <>
                      <ShieldCheck className="h-4 w-4" /> Admin
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" /> Member
                    </>
                  )}
                </div>
              </div>

              {/* Meta rows */}
              <div className="border-t border-gray-100 divide-y divide-gray-100">
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Member since
                  </span>
                  <span className="text-sm font-bold">
                    {format(new Date(user.createdAt), "MMM yyyy")}
                  </span>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Tenure
                  </span>
                  <span className="text-sm font-bold">
                    {tenureMonths} months
                  </span>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Verified
                  </span>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      user.emailVerified ? "text-black" : "text-gray-400",
                    )}
                  >
                    {user.emailVerified ? "Yes" : "No"}
                  </span>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                    Last active
                  </span>
                  <span className="text-sm font-bold">
                    {format(new Date(user.updatedAt), "dd MMM yyyy")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right — Stats + Orders */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Stat cards */}
            <div className="grid sm:grid-cols-3 gap-4">
              {[
                {
                  label: "Total Orders",
                  value: user._count.orders.toString(),
                  icon: <Package className="h-5 w-5" />,
                },
                {
                  label: "Total Spent",
                  value: formatRupiah(totalSpent),
                  icon: <Wallet className="h-5 w-5" />,
                },
                {
                  label: "Avg. Order",
                  value:
                    user._count.orders > 0
                      ? formatRupiah(totalSpent / user._count.orders)
                      : "—",
                  icon: <Calendar className="h-5 w-5" />,
                },
              ].map((stat, i) => (
                <div key={i} className="border border-gray-200 bg-white p-5">
                  <div className="flex items-center gap-2 mb-3 text-gray-400">
                    {stat.icon}
                    <span className="text-xs font-bold uppercase tracking-widest">
                      {stat.label}
                    </span>
                  </div>
                  <p className="text-2xl font-black tracking-tight">
                    {stat.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Recent orders */}
            <div className="border border-gray-200 bg-white overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                <h3 className="text-base font-black uppercase tracking-tight">
                  Recent Orders
                  <span className="ml-2 text-xs font-bold text-gray-400 normal-case tracking-normal">
                    ({user.orders.length} of {user._count.orders})
                  </span>
                </h3>
                <Link href="/admin/orders">
                  <Button
                    variant="outline"
                    className="h-8 text-xs font-bold uppercase tracking-widest border border-gray-300 rounded-none hover:bg-black hover:text-white transition-colors"
                  >
                    View All
                  </Button>
                </Link>
              </div>

              {user.orders.length === 0 ? (
                <div className="py-16 text-center text-gray-400">
                  <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
                  <p className="text-sm font-bold uppercase tracking-widest">
                    No orders yet
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {user.orders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 border border-gray-200 bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600 shrink-0">
                          #{order.id.slice(-4).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {format(new Date(order.createdAt), "MMM dd, yyyy")}
                          </p>
                          <p className="text-sm font-black">
                            {formatRupiah(Number(order.totalAmount))}
                          </p>
                        </div>
                      </div>

                      <Badge
                        className={cn(
                          "rounded-none border-0 px-3 py-1 text-[10px] font-bold uppercase tracking-widest",
                          statusColors[order.status] ??
                            "bg-gray-100 text-gray-600",
                        )}
                      >
                        {order.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
