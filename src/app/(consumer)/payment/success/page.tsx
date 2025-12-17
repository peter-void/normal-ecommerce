import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getOrderDetails } from "@/dal/getOrders";
import { formatRupiah } from "@/lib/format";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  CreditCard,
  Package,
  Receipt,
  ShoppingBag,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    order_id: string;
    status_code: string;
    transaction_status: string;
  }>;
}) {
  const { order_id, status_code, transaction_status } = await searchParams;

  if (!order_id || !status_code || !transaction_status) {
    return redirect("/");
  }

  const order = await getOrderDetails(order_id);

  return (
    <div className="min-h-screen bg-[#A855F7] p-6 md:p-12 flex items-center justify-center font-sans mt-16">
      {/* Decorative background pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(45deg,#00000011_25%,transparent_25%,transparent_50%,#00000011_50%,#00000011_75%,transparent_75%,transparent)] bg-size-[60px_60px] pointer-events-none" />

      <div className="relative w-full max-w-4xl grid md:grid-cols-[1fr_350px] gap-8 items-start">
        {/* Main Success Card */}
        <div className="bg-white border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[14px_14px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 p-8 md:p-12 flex flex-col items-center text-center relative z-10">
          <div className="mb-6 relative">
            <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-50 animate-pulse" />
            <CheckCircle2 className="w-24 h-24 text-green-500 relative z-10 fill-white" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter mb-4 transform -rotate-2">
            Payment
            <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-600 to-pink-600">
              Successful!
            </span>
          </h1>

          <p className="text-xl font-medium text-gray-600 max-w-md mx-auto mb-8">
            Boom! Your order is confirmed. We're prepping your loot right now.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              asChild
              className="flex-1 h-14 text-lg font-bold border-4 border-black bg-white text-black hover:bg-black hover:text-white shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all rounded-none"
            >
              <Link href="/cart">
                <ShoppingBag className="mr-2 w-5 h-5" />
                Keep Shopping
              </Link>
            </Button>
            <Button
              asChild
              className="flex-1 h-14 text-lg font-bold border-4 border-black bg-yellow-400 text-black hover:bg-yellow-500 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[6px] hover:translate-y-[6px] transition-all rounded-none"
            >
              <Link href={`/orders/${order.id}`}>
                Track Order
                <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Receipt / Details Side Panel */}
        <div className="bg-[#FFF8E7] border-4 border-black shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] relative z-10">
          {/* Receipt ZigZap Top */}
          <div className="h-4 bg-black w-full relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_75%,#FFF8E7_75%),linear-gradient(-45deg,transparent_75%,#FFF8E7_75%)] bg-size-[20px_20px] bg-position-[0_10px]" />
          </div>

          <div className="p-6 space-y-6">
            <div className="border-b-4 border-black pb-4 text-center">
              <h2 className="text-2xl font-black uppercase flex items-center justify-center gap-2">
                <Receipt className="w-6 h-6" />
                Receipt
              </h2>
              <p className="font-mono text-sm mt-1 opacity-70">
                ID: {order.id}
              </p>
            </div>

            <div className="space-y-4 font-mono text-sm leading-relaxed">
              <div className="flex justify-between">
                <span className="opacity-60">Status:</span>
                <span className="font-bold bg-green-200 px-2 border-2 border-black text-green-900 uppercase">
                  {order.status}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Date:</span>
                <span className="font-bold">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString()
                    : "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="opacity-60">Method:</span>
                <span className="font-bold uppercase">
                  {order.paymentMethod?.replace("_", " ") || "TF"}
                </span>
              </div>
            </div>

            <Separator className="bg-black h-1" />

            <div className="space-y-3">
              {order.orderItems.map((item: any) => (
                <div
                  key={item.id}
                  className="flex justify-between gap-2 text-sm font-medium"
                >
                  <span className="truncate flex-1">
                    {item.quantity}x {item.product.name}
                  </span>
                  <span className="tabular-nums font-bold">
                    {formatRupiah(item.price)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t-4 border-dashed border-black pt-4 mt-6">
              <div className="flex justify-between items-end">
                <span className="text-lg font-bold">TOTAL</span>
                <span className="text-2xl font-black bg-black text-white px-2 transform skew-x-[-10deg] inline-block">
                  {formatRupiah(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Receipt ZigZag Bottom */}
          <div className="h-4 bg-[#FFF8E7] w-full relative overflow-hidden -mb-px">
            <div className="absolute bottom-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_75%,black_75%),linear-gradient(-45deg,transparent_75%,black_75%)] bg-size-[20px_20px] bg-position-[0_10px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
