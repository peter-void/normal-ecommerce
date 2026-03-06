"use client";

import { useState } from "react";
import {
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Download,
  Eye,
  RefreshCw,
  Activity,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

interface StatCard {
  title: string;
  value: string;
  progress: number;
  color: string;
  previousValue?: number;
  currentValue?: number;
}

interface StatsCardsProps {
  stats: StatCard[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  const router = useRouter();
  const [selectedStat, setSelectedStat] = useState<StatCard | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [refreshingCard, setRefreshingCard] = useState<string | null>(null);

  const calculateChange = (current: number, previous: number) => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  };

  const handleViewDetails = (stat: StatCard) => {
    setSelectedStat(stat);
    setIsDetailsOpen(true);
  };

  const handleExport = (stat: StatCard) => {
    const loadingToast = toast.loading("Preparing your data...");
    setTimeout(() => {
      const csvData = [
        ["Metric", "Value", "Progress", "Change"],
        [
          stat.title,
          stat.value,
          `${stat.progress.toFixed(2)}%`,
          stat.currentValue && stat.previousValue
            ? `${calculateChange(stat.currentValue, stat.previousValue).toFixed(2)}%`
            : "N/A",
        ],
      ];
      const csvContent = csvData.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${stat.title.toLowerCase().replace(/\s+/g, "_")}_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      toast.dismiss(loadingToast);
      toast.success("Export successful!", {
        description: "CSV file downloaded",
      });
    }, 1000);
  };

  const handleRefresh = async (title: string) => {
    setRefreshingCard(title);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setRefreshingCard(null);
    toast.success("Data refreshed!");
    router.refresh();
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stats.map((stat, i) => {
          const hasComparison =
            stat.currentValue !== undefined && stat.previousValue !== undefined;
          const changePercent = hasComparison
            ? calculateChange(stat.currentValue!, stat.previousValue!)
            : 0;
          const isPositive = changePercent >= 0;
          const isRefreshing = refreshingCard === stat.title;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white border border-gray-200 p-6 relative overflow-hidden"
            >
              <AnimatePresence>
                {isRefreshing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RefreshCw className="h-8 w-8 text-black" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-gray-500">
                    {stat.title}
                  </span>
                  {hasComparison && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2"
                    >
                      {isPositive ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-gray-300">
                          <TrendingUp className="h-3 w-3 text-black" />
                          <span className="text-xs font-bold text-black">
                            +{changePercent.toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-gray-100 border border-gray-300">
                          <TrendingDown className="h-3 w-3 text-gray-600" />
                          <span className="text-xs font-bold text-gray-600">
                            {changePercent.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      <span className="text-xs text-gray-400">
                        vs last month
                      </span>
                    </motion.div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1.5 border border-gray-200 hover:bg-gray-100 transition-colors focus:outline-none">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-48 border border-gray-200 bg-white rounded-none font-bold shadow-none"
                  >
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(stat)}
                      className="cursor-pointer gap-2 hover:bg-gray-100 rounded-none"
                    >
                      <Eye className="h-4 w-4" /> View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExport(stat)}
                      className="cursor-pointer gap-2 hover:bg-gray-100 rounded-none"
                    >
                      <Download className="h-4 w-4" /> Export CSV
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200" />
                    <DropdownMenuItem
                      onClick={() => handleRefresh(stat.title)}
                      className="cursor-pointer gap-2 hover:bg-gray-100 rounded-none"
                    >
                      <RefreshCw className="h-4 w-4" /> Refresh
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <motion.div
                className="text-4xl font-black mb-6 tracking-tight"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {stat.value}
              </motion.div>

              {/* Progress bar — thin, B&W */}
              <div className="h-1 w-full bg-gray-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-black"
                />
              </div>
              <div className="mt-1 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {stat.progress.toFixed(0)}% of target
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-lg border border-gray-200 rounded-none shadow-none font-mono">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black uppercase tracking-tight">
              {selectedStat?.title} Details
            </DialogTitle>
          </DialogHeader>

          {selectedStat && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 mt-2"
            >
              <div className="bg-gray-50 border border-gray-200 p-6 text-center">
                <div className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Current Value
                </div>
                <div className="text-5xl font-black">{selectedStat.value}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-4 w-4" />
                    <span className="text-xs font-bold uppercase">
                      Progress
                    </span>
                  </div>
                  <div className="text-2xl font-black">
                    {selectedStat.progress.toFixed(1)}%
                  </div>
                </div>

                {selectedStat.currentValue !== undefined &&
                  selectedStat.previousValue !== undefined && (
                    <div className="border border-gray-200 p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-4 w-4" />
                        <span className="text-xs font-bold uppercase">
                          vs Last Month
                        </span>
                      </div>
                      <div className="text-2xl font-black flex items-center gap-2">
                        {calculateChange(
                          selectedStat.currentValue,
                          selectedStat.previousValue,
                        ) >= 0 ? (
                          <TrendingUp className="h-5 w-5" />
                        ) : (
                          <TrendingDown className="h-5 w-5" />
                        )}
                        {Math.abs(
                          calculateChange(
                            selectedStat.currentValue,
                            selectedStat.previousValue,
                          ),
                        ).toFixed(1)}
                        %
                      </div>
                    </div>
                  )}
              </div>

              <div className="border border-gray-200 p-4">
                <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                  Insight
                </p>
                <p className="text-sm font-medium">
                  {selectedStat.currentValue &&
                  selectedStat.previousValue &&
                  selectedStat.currentValue > selectedStat.previousValue
                    ? "Revenue is trending upward. Keep up the momentum."
                    : selectedStat.currentValue &&
                        selectedStat.previousValue &&
                        selectedStat.currentValue < selectedStat.previousValue
                      ? "Revenue has decreased from last month. Review your marketing strategies."
                      : "Business metrics are being tracked. Continue monitoring for trends."}
                </p>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
