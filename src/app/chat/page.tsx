"use client";

import type { JSX } from "react";
import { ChatShowcase } from "@/components/landing-components/ChatShowcase/ChatShowcase";

export default function ChatPage(): JSX.Element {
  return (
    <>
      <div className="py-8">
        <h1 className="text-3xl font-bold mb-4">Chat System Test</h1>
        <p className="text-gray-600 mb-8">
          Testing chat functionality and tool integrations
        </p>
      </div>

      <ChatShowcase enableTesting={true} />
    </>
  );
}
