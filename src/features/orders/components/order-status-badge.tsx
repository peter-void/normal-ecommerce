import { OrderStatus } from "@/generated/prisma/enums";
import { cn } from "@/lib/utils";

const statusConfig: Record<OrderStatus, { label: string; className: string }> =
  {
    PENDING: {
      label: "PENDING",
      className:
        "bg-yellow-400 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    },
    PAID: {
      label: "PAID",
      className:
        "bg-blue-400 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    },

    SHIPPED: {
      label: "SHIPPED",
      className:
        "bg-orange-400 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    },
    DELIVERED: {
      label: "DELIVERED",
      className:
        "bg-[#22C55E] text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    },
    CANCELLED: {
      label: "CANCELLED",
      className:
        "bg-red-400 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    },
    EXPIRED: {
      label: "EXPIRED",
      className:
        "bg-zinc-400 text-black border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
    },
  };

export function OrderStatusBadge({
  status,
  className,
}: {
  status: OrderStatus;
  className?: string;
}) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        "inline-flex items-center px-4 py-1.5 border-4 border-black text-[12px] font-black uppercase tracking-widest",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
