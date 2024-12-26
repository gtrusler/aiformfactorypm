"use client";

import type { JSX } from "react";
import { ChatInterface } from "@/components/app-components/Chat/ChatInterface";
import type { Message, ToolType } from "@/types/chat";

const INITIAL_MESSAGE: Message = {
  role: "assistant",
  content: "Hello! I'm your AI assistant. How can I help you today?",
};

export default function ChatPage(): JSX.Element {
  const handleMessageSent = async (message: Message): Promise<void> => {
    // Handle message sending
    console.log("Message sent:", message);
  };

  const handleToolExecution = async (
    tool: ToolType,
    result: unknown
  ): Promise<unknown> => {
    // Handle tool execution
    console.log("Tool executed:", tool, result);
    return result;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto py-8">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden">
            {/* Chat Header */}
            <div className="bg-gray-50 border-b px-4 py-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full" />
                <span className="text-sm font-medium">AI Assistant</span>
              </div>
            </div>

            {/* Chat Interface */}
            <div className="h-[calc(100vh-12rem)] flex flex-col">
              <ChatInterface
                className="flex-1"
                initialMessages={[INITIAL_MESSAGE]}
                onMessageSent={handleMessageSent}
                onToolExecution={handleToolExecution}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
