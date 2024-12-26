import React from "react";
import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export function MessageBubble({
  message,
  className,
}: MessageBubbleProps): React.JSX.Element {
  const isAI = message.role === "assistant";
  const isSystem = message.role === "system";

  return (
    <div
      className={cn(
        "flex",
        {
          "justify-start": isAI || isSystem,
          "justify-end": !isAI && !isSystem,
        },
        className
      )}
    >
      <div
        className={cn("max-w-[70%] rounded-lg p-4", {
          "bg-gray-100": isAI,
          "bg-yellow-50": isSystem,
          "bg-blue-100": !isAI && !isSystem,
        })}
      >
        <div className="text-sm whitespace-pre-wrap">{message.content}</div>

        {message.metadata?.error && (
          <div className="text-xs text-red-500 mt-2">
            Error occurred during processing
          </div>
        )}
      </div>
    </div>
  );
}
