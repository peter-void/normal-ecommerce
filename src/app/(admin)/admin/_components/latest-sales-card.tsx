"use client";

import { Pagination } from "@/components/pagination";
import { getLatestSales } from "@/features/dashboard/actions/action";
import { cn } from "@/lib/utils";
import { CheckCircle2, Clock } from "lucide-react";
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
          page
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
    <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black uppercase italic">Latest Sales</h2>
        <div className="flex items-center gap-2 text-sm font-bold bg-gray-100 px-3 py-1 rounded-full border-2 border-transparent">
          {data.meta.total} Total Orders
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
            loading && "opacity-50 pointer-events-none"
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
                className="group flex items-center justify-between p-4 border-2 border-black rounded-xl hover:bg-[#FFF5E0] transition-colors relative"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 border-2 border-black rounded-lg overflow-hidden bg-gray-100 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-all group-hover:translate-x-[2px] group-hover:translate-y-[2px]">
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

                  <div
                    className={cn(
                      "hidden sm:flex px-3 py-1 rounded-full border-2 border-black text-xs font-black items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
                      sale.status === "Paid" ? "bg-[#c6f6d5]" : "bg-[#fefcbf]"
                    )}
                  >
                    {sale.status === "Paid" ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                    {sale.status}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t-2 border-black/10">
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
