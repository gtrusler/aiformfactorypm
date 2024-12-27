import React from "react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Chat | AI Form Factory",
  description: "Interactive AI Chat Interface for form creation and management",
};

export default function ChatLayout({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
