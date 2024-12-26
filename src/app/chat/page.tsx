"use client";

import { FormEvent, useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import type { Message } from "@/types/chat";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string>("");
  const supabase = createClientComponentClient();

  // Check environment variables
  useEffect(() => {
    console.log("Environment check:", {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    });
  }, []);

  useEffect(() => {
    // Generate a unique thread ID when the component mounts
    const id = crypto.randomUUID();
    setThreadId(id);
    console.log("Generated thread ID:", id);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isLoading || !threadId) return;

    setIsLoading(true);
    try {
      // Add user message to UI immediately
      const userMessage: Message = {
        role: "user",
        content: inputMessage,
      };
      setMessages((prev) => [...prev, userMessage]);

      // Save user message to Supabase
      console.log("Saving message:", {
        thread_id: threadId,
        speaker_id: "user",
        message: inputMessage,
      });

      const { data, error } = await supabase
        .from("chat_histories")
        .insert([
          {
            thread_id: threadId,
            speaker_id: "user",
            message: inputMessage,
            metadata: {},
          },
        ])
        .select();

      if (error) {
        console.error("Failed to save message:", error);
      } else {
        console.log("Message saved:", data);
      }

      // Simulate assistant response
      const assistantMessage: Message = {
        role: "assistant",
        content:
          "This is a test response. The real AI integration is temporarily disabled for debugging.",
      };

      // Save assistant message
      const { data: assistantData, error: assistantError } = await supabase
        .from("chat_histories")
        .insert([
          {
            thread_id: threadId,
            speaker_id: "assistant",
            message: assistantMessage.content,
            metadata: {},
          },
        ])
        .select();

      if (assistantError) {
        console.error("Failed to save assistant message:", assistantError);
      } else {
        console.log("Assistant message saved:", assistantData);
      }

      setMessages((prev) => [...prev, assistantMessage]);
      setInputMessage("");
    } catch (error) {
      console.error("Error in handleSubmit:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              message.role === "user" ? "bg-blue-100 ml-auto" : "bg-gray-100"
            } max-w-[80%]`}
          >
            {message.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex space-x-4">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 p-2 border rounded-lg"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}
