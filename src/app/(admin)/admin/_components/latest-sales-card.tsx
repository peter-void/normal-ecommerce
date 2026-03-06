"use client";

import { Pagination } from "@/components/pagination";
import { getLatestSales } from "@/features/dashboard/actions/action";
import { cn } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  PackageCheck,
  Truck,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { DateRange } from "./date-range-picker";

type Sale = {
  id: string;
  name: string;
  date: string;
  amount: string;
  status: string;
  image: string;
};

type SalesData = {
  data: Sale[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

interface LatestSalesCardProps {
  initialData: SalesData;
  dateRange: DateRange;
}

const statusConfig: Record<
  string,
  { color: string; icon: any; label: string }
> = {
  PENDING: {
    color: "bg-gray-100 text-gray-700",
    icon: Clock,
    label: "Pending",
  },
  PAID: {
    color: "bg-black text-white",
    icon: CheckCircle2,
    label: "Paid",
  },
  SHIPPED: {
    color: "bg-gray-700 text-white",
    icon: Truck,
    label: "Shipped",
  },
  DELIVERED: {
    color: "bg-gray-900 text-white",
    icon: PackageCheck,
    label: "Delivered",
  },
  CANCELLED: {
    color: "bg-gray-200 text-gray-600",
    icon: XCircle,
    label: "Cancelled",
  },
  EXPIRED: {
    color: "bg-gray-100 text-gray-500",
    icon: AlertCircle,
    label: "Expired",
  },
};

export function LatestSalesCard({
  initialData,
  dateRange,
}: LatestSalesCardProps) {
  const [data, setData] = useState<SalesData>(initialData);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialData.meta.page);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getLatestSales(
          dateRange?.from,
          dateRange?.to,
          page,
        );
        setData(result);
        setPage(page);
      } catch (error) {
        console.error("Failed to fetch sales:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page]);

  useEffect(() => {
    setPage(initialData.meta.page);
  }, [initialData.meta.page]);

  return (
    <div className="bg-white border border-gray-200 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold uppercase tracking-tight">
          Latest Sales
        </h2>
        <div className="text-xs font-bold text-gray-500 uppercase tracking-widest">
          {data.meta.total} Orders
        </div>
      </div>

      <div className="flex-1 min-h-[300px]">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" />
          </div>
        )}

        <div
          className={cn(
            "space-y-4",
            loading && "opacity-50 pointer-events-none",
          )}
        >
          {data.data.length === 0 ? (
            <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
              <p className="font-bold">No sales found for this period</p>
            </div>
          ) : (
            data.data.map((sale) => (
              <div
                key={sale.id}
                className="group flex items-center justify-between p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 border border-gray-200 overflow-hidden bg-gray-100">
                    <img
                      src={sale.image}
                      alt={sale.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="font-black text-base sm:text-lg leading-tight line-clamp-1">
                      {sale.name}
                    </div>
                    <div className="text-xs sm:text-sm font-bold text-gray-500">
                      {sale.date}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:gap-6">
                  <div className="font-black text-sm sm:text-lg text-right">
                    {sale.amount}
                  </div>

                  {(() => {
                    const config =
                      statusConfig[sale.status] || statusConfig.PENDING;
                    const Icon = config.icon;
                    return (
                      <div
                        className={cn(
                          "hidden sm:flex px-2 py-0.5 border border-gray-200 text-xs font-bold items-center gap-1.5",
                          config.color,
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {config.label}
                      </div>
                    );
                  })()}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
        <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          Page {data.meta.page} of {data.meta.totalPages}
        </div>
        <Pagination
          page={String(data.meta.page)}
          totalPages={data.meta.totalPages}
          hasNextPage={data.meta.hasNextPage}
        />
      </div>
    </div>
  );
}
