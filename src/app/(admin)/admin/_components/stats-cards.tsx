"use client";

import { useState } from "react";
import {
  MoreVertical,
  TrendingUp,
  TrendingDown,
  Download,
  Eye,
  RefreshCw,
  X,
  Sparkles,
  DollarSign,
  Calendar,
  Activity,
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
import confetti from "canvas-confetti";
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

    confetti({
      particleCount: 30,
      spread: 50,
      origin: { y: 0.6 },
      colors: ["#a888f8", "#22c55e", "#fbbf24"],
    });
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
            ? `${calculateChange(stat.currentValue, stat.previousValue).toFixed(
                2
              )}%`
            : "N/A",
        ],
      ];

      const csvContent = csvData.map((row) => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${stat.title.toLowerCase().replace(/\s+/g, "_")}_${
        new Date().toISOString().split("T")[0]
      }.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      toast.dismiss(loadingToast);
      toast.success("Export successful!", {
        description: "CSV file has been downloaded",
      });

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#22c55e", "#10b981", "#34d399"],
      });
    }, 1000);
  };

  const handleRefresh = async (title: string) => {
    setRefreshingCard(title);

    await new Promise((resolve) => setTimeout(resolve, 1500));

    setRefreshingCard(null);

    toast.success("Data refreshed!", {
      description: "Latest stats have been loaded",
    });
    router.refresh();

    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0, y: 0.8 },
      colors: ["#a888f8", "#c4b5fd", "#8b5cf6"],
    });
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
              className="group bg-white border-4 border-black p-6 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden"
            >
              <AnimatePresence>
                {isRefreshing && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-linear-to-br from-purple-100/80 to-pink-100/80 backdrop-blur-sm z-10 flex items-center justify-center"
                  >
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RefreshCw className="h-12 w-12 text-purple-600" />
                    </motion.div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.2, 1] }}
                      transition={{ duration: 0.5 }}
                      className="absolute"
                    >
                      <Sparkles className="h-24 w-24 text-yellow-400 opacity-50" />
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xl font-bold uppercase">
                    {stat.title}
                  </span>
                  {hasComparison && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex items-center gap-2"
                    >
                      {isPositive ? (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-green-100 border-2 border-black rounded-full">
                          <TrendingUp className="h-3 w-3 text-green-600" />
                          <span className="text-xs font-black text-green-600">
                            +{changePercent.toFixed(1)}%
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-2 py-0.5 bg-red-100 border-2 border-black rounded-full">
                          <TrendingDown className="h-3 w-3 text-red-600" />
                          <span className="text-xs font-black text-red-600">
                            {changePercent.toFixed(1)}%
                          </span>
                        </div>
                      )}
                      <span className="text-xs font-bold text-gray-500">
                        vs last month
                      </span>
                    </motion.div>
                  )}
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-2 border-2 border-black rounded-full hover:bg-gray-100 hover:scale-110 transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2">
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-56 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg font-bold"
                  >
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(stat)}
                      className="cursor-pointer gap-2 hover:bg-purple-100 bg-white"
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleExport(stat)}
                      className="cursor-pointer gap-2 hover:bg-green-100 bg-white"
                    >
                      <Download className="h-4 w-4" />
                      Export Data
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-black" />
                    <DropdownMenuItem
                      onClick={() => handleRefresh(stat.title)}
                      className="cursor-pointer gap-2 hover:bg-blue-100 bg-white"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Refresh
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <motion.div
                className="text-4xl font-black mb-6"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {stat.value}
              </motion.div>

              <div className="h-3 w-full bg-gray-100 border-2 border-black rounded-full overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stat.progress}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${stat.color}`}
                />
                {stat.progress > 10 && (
                  <div className="absolute inset-0 flex items-center justify-end pr-2">
                    <span className="text-[10px] font-black text-black/50">
                      {stat.progress.toFixed(0)}%
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-mono">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black uppercase flex items-center gap-2">
              <Sparkles className="h-8 w-8 text-purple-500" />
              {selectedStat?.title} Details
            </DialogTitle>
          </DialogHeader>

          {selectedStat && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6 mt-4"
            >
              <div className="bg-linear-to-br from-purple-100 to-pink-100 border-4 border-black rounded-xl p-8 text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Sparkles className="h-8 w-8" />
                  <span className="text-sm font-bold text-gray-600 uppercase">
                    Current Value
                  </span>
                </div>
                <div className="text-6xl font-black">{selectedStat.value}</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="bg-green-100 border-4 border-black rounded-xl p-4"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Activity className="h-5 w-5 text-green-600" />
                    <span className="text-xs font-bold uppercase">
                      Progress
                    </span>
                  </div>
                  <div className="text-3xl font-black">
                    {selectedStat.progress.toFixed(1)}%
                  </div>
                </motion.div>

                {selectedStat.currentValue !== undefined &&
                  selectedStat.previousValue !== undefined && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className={`${
                        selectedStat.currentValue >= selectedStat.previousValue
                          ? "bg-green-100"
                          : "bg-red-100"
                      } border-4 border-black rounded-xl p-4`}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="h-5 w-5" />
                        <span className="text-xs font-bold uppercase">
                          vs Last Month
                        </span>
                      </div>
                      <div className="text-3xl font-black flex items-center gap-2">
                        {calculateChange(
                          selectedStat.currentValue,
                          selectedStat.previousValue
                        ) >= 0 ? (
                          <TrendingUp className="h-6 w-6 text-green-600" />
                        ) : (
                          <TrendingDown className="h-6 w-6 text-red-600" />
                        )}
                        {Math.abs(
                          calculateChange(
                            selectedStat.currentValue,
                            selectedStat.previousValue
                          )
                        ).toFixed(1)}
                        %
                      </div>
                    </motion.div>
                  )}
              </div>

              <div className="bg-yellow-100 border-4 border-black rounded-xl p-4">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-600" />
                  <span className="text-sm font-black uppercase">
                    AI Insight
                  </span>
                </div>
                <p className="mt-2 text-sm font-bold">
                  {selectedStat.currentValue &&
                  selectedStat.previousValue &&
                  selectedStat.currentValue > selectedStat.previousValue
                    ? "🎉 Great work! Your revenue is trending upward. Keep up the momentum!"
                    : selectedStat.currentValue &&
                      selectedStat.previousValue &&
                      selectedStat.currentValue < selectedStat.previousValue
                    ? "📊 Revenue has decreased from last month. Consider reviewing your marketing strategies."
                    : "💼 Your business metrics are being tracked. Continue monitoring for trends."}
                </p>
              </div>
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
