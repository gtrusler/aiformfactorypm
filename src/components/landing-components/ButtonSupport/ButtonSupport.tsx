"use client";

import type { JSX } from "react";
import { cn } from "@/lib/utils";

interface ButtonSupportProps {
  className?: string;
  onClick?: () => void;
}

export function ButtonSupport({
  className,
  onClick,
}: ButtonSupportProps): JSX.Element {
  return (
    <button
      className={cn(
        "px-4 py-2 text-sm font-medium text-white bg-green-500 rounded-lg hover:bg-green-600 transition-colors",
        className
      )}
      onClick={onClick}
    >
      Get Support
    </button>
  );
}
