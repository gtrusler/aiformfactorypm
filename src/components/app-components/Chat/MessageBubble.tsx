import React from "react";
import ReactMarkdown from "react-markdown";
import type { Message } from "@/types/chat";
import { cn } from "@/lib/utils";
import type { Components } from "react-markdown";

interface MessageBubbleProps {
  message: Message;
}

interface CodeProps extends React.HTMLAttributes<HTMLElement> {
  inline?: boolean;
}

export function MessageBubble({
  message,
}: MessageBubbleProps): React.JSX.Element {
  const isUser = message.role === "user";
  const isError = message.metadata?.error === true;

  const components: Components = {
    pre: ({ children }) => (
      <pre className="rounded-md bg-gray-800 p-4 overflow-x-auto">
        {children}
      </pre>
    ),
    code: ({ inline, className, children, ...props }: CodeProps) => {
      if (inline) {
        return (
          <code className="rounded bg-gray-200 px-1 py-0.5" {...props}>
            {children}
          </code>
        );
      }
      return (
        <code className={cn("text-sm", className)} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <div className={cn("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-lg px-4 py-2",
          isUser ? "bg-blue-500 text-white" : "bg-gray-100",
          isError && "bg-red-100 text-red-800"
        )}
      >
        <ReactMarkdown
          className={cn(
            "prose prose-sm max-w-none",
            isUser && "prose-invert",
            !isUser && [
              "prose-headings:text-gray-800",
              "prose-p:text-gray-600",
              "prose-strong:text-gray-800",
              "prose-code:text-gray-800",
              "prose-pre:bg-gray-800",
              "prose-pre:text-gray-100",
            ]
          )}
          components={components}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
