"use client";

import type { JSX } from "react";
import { cn } from "@/lib/utils";

interface ButtonAccountProps {
  className?: string;
  onClick?: () => void;
}

export function ButtonAccount({
  className,
  onClick,
}: ButtonAccountProps): JSX.Element {
  return (
    <button
      className={cn(
        "px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
        className
      )}
      onClick={onClick}
    >
      Account
    </button>
  );
}
