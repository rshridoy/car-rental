"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({ carId, carName }: { carId: string; carName: string }) {
  const { isWishlisted, toggle } = useWishlist();
  const wished = isWishlisted(carId);

  return (
    <Button
      variant="outline"
      size="icon"
      className="shrink-0 rounded-full"
      aria-pressed={wished}
      aria-label={wished ? `Remove ${carName} from wishlist` : `Add ${carName} to wishlist`}
      onClick={() => {
        toggle(carId);
        toast.success(wished ? `Removed ${carName} from wishlist` : `Added ${carName} to wishlist`);
      }}
    >
      <Heart className={cn("h-4 w-4", wished && "fill-destructive text-destructive")} />
    </Button>
  );
}
