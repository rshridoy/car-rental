import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const VARIANTS = {
  solid: {
    box: "bg-muted-foreground/50",
    icon: "text-white",
  },
  subtle: {
    box: "bg-card ring-1 ring-border",
    icon: "text-muted-foreground/50",
  },
};

export function ImagePlaceholder({
  className,
  iconClassName,
  variant = "solid",
  label,
}: {
  className?: string;
  iconClassName?: string;
  variant?: keyof typeof VARIANTS;
  label?: string;
}) {
  const styles = VARIANTS[variant];

  return (
    <div
      role="img"
      aria-label={label ?? "Placeholder image"}
      className={cn("flex items-center justify-center rounded-2xl", styles.box, className)}
    >
      <ImageIcon strokeWidth={1.5} className={cn("h-10 w-10", styles.icon, iconClassName)} />
    </div>
  );
}
