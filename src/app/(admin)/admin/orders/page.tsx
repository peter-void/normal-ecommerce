import { PAGE_SIZE } from "@/constants";
import { getAdminOrders } from "./actions";
import { OrderList } from "@/features/admin/orders/order-list";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const search = params.search || "";

  const { orders, metadata, stats } = await getAdminOrders({
    page,
    limit: PAGE_SIZE,
    search,
  });

  return (
    <div className="min-h-screen bg-white p-6 lg:p-10 space-y-12">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex flex-col gap-2">
          <h1 className="text-4xl font-black uppercase tracking-tighter">
            Order Management
          </h1>
          <p className="text-lg font-bold text-black/60">
            View and manage customer orders.
          </p>
        </div>

        <OrderList
          initialOrders={orders as any}
          initialMetadata={metadata}
          initialStats={stats}
        />
      </div>
    </div>
  );
}
