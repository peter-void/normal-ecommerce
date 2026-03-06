import { clearCartAfterPayment } from "@/features/checkout/actions/clear-cart-action";
import { auth } from "@/lib/auth";
import { formatRupiah } from "@/lib/format";
import prisma from "@/lib/prisma";
import { format } from "date-fns";
import {
  ArrowRightIcon,
  CheckCircle2Icon,
  ClockIcon,
  PackageIcon,
  XCircleIcon,
} from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { redirect } from "next/navigation";

interface PageProps {
  searchParams: Promise<{
    order_id?: string;
    status_code?: string;
    transaction_status?: string;
  }>;
}

export default async function OrderSuccessPage({ searchParams }: PageProps) {
  const { order_id } = await searchParams;

  if (!order_id) redirect("/");

  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) redirect("/signin");

  // Always read from DB — authoritative source of truth
  const order = await prisma.order.findUnique({
    where: { id: order_id, userId: session.user.id },
    include: {
      orderItems: {
        include: {
          product: { include: { images: true } },
        },
      },
    },
  });

  if (!order) redirect("/");

  // Clear cart if order is PAID (idempotent — safe to call multiple times)
  if (order.status === "PAID") {
    await clearCartAfterPayment(order_id);
  }

  // ─── UI States ───────────────────────────────────────
  const isPaid = order.status === "PAID";
  const isPending = order.status === "PENDING";
  const isFailed = order.status === "CANCELLED" || order.status === "EXPIRED";

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start pt-24 pb-16 px-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Status Banner */}
        {isPaid && (
          <div className="flex flex-col items-center text-center py-10 border border-gray-200">
            <div className="w-16 h-16 bg-black flex items-center justify-center mb-5">
              <CheckCircle2Icon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
              Payment Confirmed!
            </h1>
            <p className="text-gray-500 text-sm max-w-xs">
              Your order has been confirmed and is being prepared. You will
              receive updates via your order page.
            </p>
          </div>
        )}

        {isPending && (
          <div className="flex flex-col items-center text-center py-10 border border-gray-200 bg-gray-50">
            <div className="w-16 h-16 bg-gray-800 flex items-center justify-center mb-5">
              <ClockIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2">
              Payment Processing...
            </h1>
            <p className="text-gray-500 text-sm max-w-xs">
              Your payment is being verified. This may take a few moments. Your
              order status will update automatically once confirmed.
            </p>
          </div>
        )}

        {isFailed && (
          <div className="flex flex-col items-center text-center py-10 border border-red-200 bg-red-50">
            <div className="w-16 h-16 bg-red-500 flex items-center justify-center mb-5">
              <XCircleIcon className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tight mb-2 text-red-700">
              Payment Failed
            </h1>
            <p className="text-red-500 text-sm max-w-xs">
              Your order was{" "}
              {order.status === "EXPIRED" ? "expired" : "cancelled"} and stock
              has been restored. Please try again.
            </p>
          </div>
        )}

        {/* Order Summary Card */}
        <div className="border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PackageIcon className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-black uppercase tracking-widest">
                Order Summary
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none">
                Order ID
              </p>
              <p className="text-xs font-black">
                #{order.id.slice(-8).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Items */}
          <div className="divide-y divide-gray-100">
            {order.orderItems.map((item) => (
              <div key={item.id} className="px-6 py-4 flex items-center gap-4">
                <div className="w-12 h-12 shrink-0 bg-gray-50 border border-gray-100 overflow-hidden relative">
                  {item.product.images[0]?.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.product.images[0].src}
                      alt={item.product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400">
                      —
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm uppercase tracking-tight truncate">
                    {item.product.name}
                  </p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="font-black text-sm tabular-nums shrink-0">
                  {formatRupiah(item.product.price.toString())}
                </p>
              </div>
            ))}
          </div>

          {/* Totals + Date */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-0.5">
                Ordered On
              </p>
              <p className="text-xs font-bold">
                {format(new Date(order.createdAt), "dd MMM yyyy, HH:mm")}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 leading-none mb-0.5">
                Total Paid
              </p>
              <p className="text-xl font-black tabular-nums">
                {formatRupiah(order.totalAmount)}
              </p>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          {isFailed ? (
            <Link
              href="/cart"
              className="flex-1 h-11 bg-black text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
            >
              Back to Cart
              <ArrowRightIcon className="w-3.5 h-3.5" />
            </Link>
          ) : (
            <>
              <Link
                href="/products"
                className="flex-1 h-11 border border-gray-200 text-xs font-black uppercase tracking-widest flex items-center justify-center hover:border-black transition-colors"
              >
                Continue Shopping
              </Link>
              <Link
                href={`/profile/order/${order.id}`}
                className="flex-1 h-11 bg-black text-white text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-gray-800 transition-colors"
              >
                View Order Details
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
