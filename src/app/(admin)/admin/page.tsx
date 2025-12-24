"use client";

import {
  getDashboardStats,
  getLatestSales,
  getRecentCustomers,
  getSalesChartData,
} from "@/features/dashboard/actions/action";
import { formatRupiah } from "@/lib/format";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { CustomersCard } from "./_components/customers-card";
import {
  DateRangePicker,
  type DateRange,
} from "./_components/date-range-picker";
import { LatestSalesCard } from "./_components/latest-sales-card";
import { SalesChart } from "./_components/sales-chart";
import { StatsCards } from "./_components/stats-cards";

type DashboardData = {
  stats: {
    balance: { value: number; progress: number };
    moneyIn: { value: number; progress: number; previousValue: number };
  };
  salesChartData: Array<{ name: string; sales: number; customers: number }>;
  latestSales: {
    data: Array<{
      id: string;
      name: string;
      date: string;
      amount: string;
      status: string;
      image: string;
    }>;
    meta: {
      total: number;
      page: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
  customers: {
    data: Array<{
      name: string;
      date: string;
      amount: number;
      category: string;
    }>;
    meta: {
      total: number;
      page: number;
      totalPages: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
    };
  };
};

export default function AdminPage() {
  const [dateRange, setDateRange] = useState<DateRange>(null);
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<DashboardData | null>(null);

  const searchParams = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      startTransition(async () => {
        const startDate = dateRange?.from;
        const endDate = dateRange?.to;

        const [stats, salesChartData, latestSales, customers] =
          await Promise.all([
            getDashboardStats(startDate, endDate),
            getSalesChartData(startDate, endDate),
            getLatestSales(startDate, endDate),
            getRecentCustomers(),
          ]);

        setData({
          stats,
          salesChartData,
          latestSales,
          customers,
        });
      });
    };

    fetchData();
  }, [dateRange]);

  if (!data) {
    return (
      <div className="flex p-6 flex-col gap-6 min-h-screen font-mono bg-[#f3f0e9] items-center justify-center">
        <div className="text-2xl font-black uppercase italic">Loading...</div>
      </div>
    );
  }

  const statsDisplay = [
    {
      title: "Balance",
      value: `${formatRupiah(data.stats.balance.value)}`,
      progress: data.stats.balance.progress,
      color: "bg-green-400",
      currentValue: Number(data.stats.balance.value),
      previousValue: 0,
    },
    {
      title: "Money in",
      value: `${formatRupiah(data.stats.moneyIn.value)}`,
      progress: data.stats.moneyIn.progress,
      color: "bg-yellow-400",
      currentValue: Number(data.stats.moneyIn.value),
      previousValue: Number(data.stats.moneyIn.previousValue),
    },
  ];

  return (
    <div className="flex p-6 flex-col gap-6 min-h-screen font-mono bg-[#f3f0e9]">
      <StatsCards stats={statsDisplay} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
              <h2 className="text-2xl font-black uppercase italic">
                Sales Overview
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#a888f8] border-2 border-black" />
                  <span className="text-sm font-bold">Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#22c55e] border-2 border-black" />
                  <span className="text-sm font-bold">Sales</span>
                </div>
                <DateRangePicker
                  dateRange={dateRange}
                  onDateRangeChange={setDateRange}
                />
              </div>
            </div>
            <div className={isPending ? "opacity-50 pointer-events-none" : ""}>
              <SalesChart
                data={data.salesChartData.map((sl) => ({
                  ...sl,
                  sales: formatRupiah(sl.sales),
                }))}
              />
            </div>
          </div>

          <LatestSalesCard
            initialData={{
              ...data.latestSales,
              meta: { ...data.latestSales.meta, page },
            }}
            dateRange={dateRange}
          />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-6">
          <CustomersCard
            initialData={{
              ...data.customers,
              meta: { ...data.customers.meta, page },
            }}
          />
        </div>
      </div>
    </div>
  );
}
