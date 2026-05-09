import * as React from "react";
import { cn } from "@/lib/utils";

interface SpinnerLoaderProps extends React.HTMLAttributes<HTMLDivElement> {
  message?: string;
  size?: "small" | "medium" | "large";
}

/**
 * Generic spinner loader component
 * @param message - Message to display next to the spinner
 * @param size - Size of the spinner
 * @param className - Classname of the container
 * @param props - Props of the container (same as HTMLDivElement)
 * @returns A spinner loader component
 */
export function SpinnerLoader({
  message,
  size = "medium",
  className,
  ...props
}: SpinnerLoaderProps) {

  const sizeClass = {
    small: "w-4 h-4",
    medium: "w-6 h-6",
    large: "w-8 h-8",
  };

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12",
        className,
      )}
      {...props}
    >
      <div
        className={cn(
          sizeClass[size],
          "border-2 border-[#fb923c] border-t-transparent rounded-full animate-spin mb-4",
        )}
      />
      <p className="text-muted-foreground">{message}</p>
    </div>
  );
}
