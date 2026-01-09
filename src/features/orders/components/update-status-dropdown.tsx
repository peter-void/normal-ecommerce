"use client";

import { updateOrderStatus } from "@/app/(admin)/admin/orders/actions";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { OrderStatus } from "@/generated/prisma/enums";
import { canTransition } from "@/lib/utils";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { OrderStatusBadge } from "./order-status-badge";

interface UpdateStatusDropdownProps {
  orderId: string;
  currentStatus: OrderStatus;
  onStatusUpdate?: (newStatus: OrderStatus) => void;
}

export function UpdateStatusDropdown({
  orderId,
  currentStatus,
  onStatusUpdate,
}: UpdateStatusDropdownProps) {
  const [orderStatus, setOrderStatus] = useState(currentStatus);
  const [isPending, startTransition] = useTransition();

  const allowedStatuses = Object.values(OrderStatus).filter((status) =>
    canTransition(orderStatus, status)
  );

  const handleStatusUpdate = (status: OrderStatus) => {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, status);
      if (result.success) {
        toast.success(`Order status updated to ${status}`);
        setOrderStatus(status);
        onStatusUpdate?.(status);
      } else {
        toast.error("Failed to update status");
      }
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-8 gap-2"
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <OrderStatusBadge status={orderStatus} className="border-0 p-0" />
          )}
          <ChevronDown className="size-3 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(allowedStatuses as OrderStatus[]).map((status) => (
          <DropdownMenuItem
            key={status}
            onClick={() => handleStatusUpdate(status)}
            disabled={status === orderStatus}
            className="flex items-center gap-2"
          >
            <OrderStatusBadge status={status} />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
