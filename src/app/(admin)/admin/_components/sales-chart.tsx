"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface SalesChartProps {
  data: Array<{
    name: string;
    sales: string;
    customers: number;
  }>;
}

export function SalesChart({ data }: SalesChartProps) {
  return (
    <div className="h-[350px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorCustomers" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#a888f8" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#a888f8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ddd" />
          <XAxis
            dataKey="name"
            axisLine={false}
            tickLine={false}
            tick={{ fontWeight: "bold" }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fontWeight: "bold" }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "4px solid black",
              boxShadow: "4px 4px 0px 0px rgba(0,0,0,1)",
              fontWeight: "bold",
            }}
          />
          <Area
            type="monotone"
            dataKey="sales"
            stroke="#22c55e"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorSales)"
          />
          <Area
            type="monotone"
            dataKey="customers"
            stroke="#a888f8"
            strokeWidth={4}
            fillOpacity={1}
            fill="url(#colorCustomers)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
