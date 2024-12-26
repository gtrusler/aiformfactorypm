import React from "react";
import type { ToolStatus, ToolType } from "@/types/chat";
import { cn } from "@/lib/utils";
import { Spinner } from "@/components/base/Spinner";

interface ToolExecutionStatusProps {
  status: ToolStatus;
  toolType: ToolType;
  className?: string;
}

export function ToolExecutionStatus({
  status,
  toolType,
  className,
}: ToolExecutionStatusProps): React.JSX.Element {
  return (
    <div
      className={cn(
        "flex items-center space-x-2 text-xs mt-2",
        {
          "text-gray-500": status === "pending",
          "text-green-500": status === "complete",
          "text-red-500": status === "error",
        },
        className
      )}
    >
      {status === "pending" && <Spinner size="xs" />}
      {status === "complete" && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5 13l4 4L19 7"
          />
        </svg>
      )}
      {status === "error" && (
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      )}
      <span>
        {toolType}: {status}
      </span>
    </div>
  );
}
