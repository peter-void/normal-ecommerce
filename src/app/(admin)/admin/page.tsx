"use client";

import {
  getDashboardStats,
  getLatestSales,
  getRecentCustomers,
  getSalesChartData,
} from "@/features/dashboard/actions/action";
import { formatRupiah } from "@/lib/format";
import { useSearchParams } from "next/navigation";
import { use, useEffect, useState, useTransition } from "react";
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

function DashboardSkeleton() {
  return (
    <div className="flex p-6 flex-col gap-6 min-h-screen animate-pulse">
      {/* Stat card skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[0, 1].map((i) => (
          <div key={i} className="border border-gray-200 bg-white p-6 h-36">
            <div className="h-4 w-24 bg-gray-200 rounded mb-4" />
            <div className="h-8 w-40 bg-gray-200 rounded mb-4" />
            <div className="h-2 w-full bg-gray-100 rounded" />
          </div>
        ))}
      </div>
      {/* Chart + table skeletons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="border border-gray-200 bg-white p-6 h-80">
            <div className="h-5 w-32 bg-gray-200 rounded mb-6" />
            <div className="h-full bg-gray-100 rounded" />
          </div>
          <div className="border border-gray-200 bg-white p-6 h-64">
            <div className="h-5 w-28 bg-gray-200 rounded mb-4" />
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-200 rounded" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 bg-gray-200 rounded" />
                  <div className="h-3 w-24 bg-gray-100 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="lg:col-span-4">
          <div className="border border-gray-200 bg-white p-6 h-80">
            <div className="h-5 w-28 bg-gray-200 rounded mb-4" />
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex justify-between mb-4">
                <div className="h-3 w-32 bg-gray-200 rounded" />
                <div className="h-3 w-20 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ page: string }>;
}) {
  const [dateRange, setDateRange] = useState<DateRange>(null);
  const [isPending, startTransition] = useTransition();
  const [data, setData] = useState<DashboardData | null>(null);

  const params = use(searchParams);
  const page = Number(params.page || "1");

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
    return <DashboardSkeleton />;
  }

  const statsDisplay = [
    {
      title: "Balance",
      value: `${formatRupiah(data.stats.balance.value)}`,
      progress: data.stats.balance.progress,
      color: "bg-black",
      currentValue: Number(data.stats.balance.value),
      previousValue: 0,
    },
    {
      title: "Money in",
      value: `${formatRupiah(data.stats.moneyIn.value)}`,
      progress: data.stats.moneyIn.progress,
      color: "bg-gray-600",
      currentValue: Number(data.stats.moneyIn.value),
      previousValue: Number(data.stats.moneyIn.previousValue),
    },
  ];

  return (
    <div className="flex p-6 flex-col gap-6 min-h-screen">
      <StatsCards stats={statsDisplay} />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="bg-white border border-gray-200 p-6">
            <div className="flex flex-wrap justify-between items-center mb-10 gap-4">
              <h2 className="text-xl font-bold uppercase tracking-tight">
                Sales Overview
              </h2>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-800" />
                  <span className="text-sm font-bold">Customers</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-gray-400" />
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
