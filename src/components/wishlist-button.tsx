import { updateWishlist } from "@/features/wishlist/actions/action";
import { Heart, Loader2Icon } from "lucide-react";
import { useTransition } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

interface WishlistButtonProps {
  productId: string;
  isWishlist: boolean;
  className?: string;
}

export function WishlistButton({
  productId,
  isWishlist,
  className,
}: WishlistButtonProps) {
  const [isPending, startTransition] = useTransition();

  const handleWishlistClick = () => {
    startTransition(async () => {
      const response = await updateWishlist(productId);

      if (!response.success) {
        toast.error(response.message);
        return;
      }

      toast.success(response.message);
    });
  };

  return (
    <button
      className={cn(
        "flex h-16 w-16 items-center justify-center border-4 border-black bg-white text-white hover:-translate-y-1 transition-transform",
        className,
      )}
      onClick={handleWishlistClick}
      disabled={isPending}
    >
      {isPending ? (
        <Loader2Icon className="size-6 animate-spin" />
      ) : isWishlist ? (
        <Heart className="h-6 w-6" fill="red" />
      ) : (
        <Heart className="h-6 w-6" fill="black" />
      )}
    </button>
  );
}
