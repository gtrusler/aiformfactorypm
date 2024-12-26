import type { Metadata } from "next";
import type { ReactNode, JSX } from "react";

export const metadata: Metadata = {
  title: "Chat | AI Form Factory",
  description: "Interactive AI Chat Interface for form creation and management",
};

export default function ChatLayout({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">{children}</div>
    </div>
  );
}
