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
        "relative flex overflow-hidden py-4 select-none",
        className,
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
              duration: 22,
            }}
            className="flex items-center whitespace-nowrap"
          >
            <span className="text-sm font-bold uppercase tracking-widest mx-6 opacity-90">
              {text}
            </span>
            <span className="text-sm font-bold uppercase tracking-widest mx-6 opacity-60">
              {text}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
