"use client";

import { Pagination } from "@/components/pagination";
import { getRecentCustomers } from "@/features/dashboard/actions/action";
import { formatRupiah } from "@/lib/format";
import { Calendar, Search } from "lucide-react";
import { useEffect, useState } from "react";

type Customer = {
  name: string;
  date: string;
  amount: number;
  category: string;
};

type CustomersData = {
  data: Customer[];
  meta: {
    total: number;
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
};

interface CustomersCardProps {
  initialData: CustomersData;
}

export function CustomersCard({ initialData }: CustomersCardProps) {
  const [data, setData] = useState<CustomersData>(initialData);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(initialData.meta.page);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const result = await getRecentCustomers(
          page,
          5,
          debouncedSearch || undefined
        );
        setData(result);
      } catch (error) {
        console.error("Failed to fetch customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, debouncedSearch]);

  useEffect(() => {
    setPage(initialData.meta.page);
  }, [initialData.meta.page]);

  return (
    <div className="bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-black uppercase italic">Customers</h2>
        <Calendar className="h-6 w-6" />
      </div>

      <div className="relative mb-8">
        <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Type to search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border-2 border-black rounded-xl font-bold focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>

      <div className="min-h-[300px] relative">
        {loading && (
          <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center rounded-xl">
            <div className="animate-spin h-8 w-8 border-4 border-black border-t-transparent rounded-full" />
          </div>
        )}

        {data.data.length === 0 ? (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-xl">
            <p className="font-bold">
              {search
                ? `No customers found for "${search}"`
                : "No customers yet"}
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {data.data.map((customer, i) => (
              <div key={i} className="flex justify-between items-start group">
                <div className="flex flex-col">
                  <span className="font-black text-lg group-hover:text-[#a888f8] transition-colors">
                    {customer.name}
                  </span>
                  <span className="text-xs font-bold text-gray-500 uppercase">
                    {customer.date} • {customer.category}
                  </span>
                </div>
                <span className="font-black text-lg">
                  {formatRupiah(customer.amount)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 flex items-center justify-between pt-6 border-t-2 border-dashed border-black">
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
