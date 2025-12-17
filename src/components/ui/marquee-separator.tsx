"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface MarqueeSeparatorProps {
  text?: string;
  className?: string;
  reverse?: boolean;
}

export function MarqueeSeparator({
  text = "BOLD STYLE • NO LIMITS • HANDPICKED • 2025 •",
  className,
  reverse = false,
}: MarqueeSeparatorProps) {
  return (
    <div
      className={cn(
        "relative flex overflow-hidden py-4 bg-black border-y-4 border-black select-none",
        className
      )}
    >
      <div className="flex w-fit">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: reverse ? "-100%" : "0%" }}
            animate={{ x: reverse ? "0%" : "-100%" }}
            transition={{
              repeat: Infinity,
              ease: "linear",
              duration: 20, // Adjust speed here
            }}
            className="flex items-center whitespace-nowrap"
          >
            <span className="text-3xl font-black uppercase text-white italic tracking-tighter mx-4">
              {text}
            </span>
            <span className="text-3xl font-black uppercase text-transparent bg-clip-text bg-linear-to-r from-purple-500 to-pink-500 italic tracking-tighter mx-4">
              {text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
