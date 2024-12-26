"use client";

import type { JSX } from "react";
import { cn } from "@/lib/utils";

interface ButtonSigninProps {
  className?: string;
  onClick?: () => void;
}

export function ButtonSignin({
  className,
  onClick,
}: ButtonSigninProps): JSX.Element {
  return (
    <button
      className={cn(
        "px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition-colors",
        className
      )}
      onClick={onClick}
    >
      Sign In
    </button>
  );
}
