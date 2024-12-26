import { useCallback, useEffect, useRef, useState } from "react";
import type {
  RealtimeChannel,
  RealtimePostgresChangesPayload,
} from "@supabase/supabase-js";
import type {
  ChatMessage,
  ChatState,
  ChatError,
  SendMessageParams,
  LoadMessagesParams,
} from "../../types/chat";
import { supabase } from "../supabase";

const MESSAGES_TABLE = "chat_messages";
const DEFAULT_LIMIT = 20;

export function useChat(threadId: string) {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: true,
    error: null,
    hasMore: true,
  });

  const channelRef = useRef<RealtimeChannel | null>(null);

  const loadMessages = useCallback(
    async ({ threadId, limit = DEFAULT_LIMIT, before }: LoadMessagesParams) => {
      try {
        setState((prev: ChatState) => ({
          ...prev,
          isLoading: true,
          error: null,
        }));

        let query = supabase
          .from(MESSAGES_TABLE)
          .select("*")
          .eq("thread_id", threadId)
          .order("created_at", { ascending: false })
          .limit(limit);

        if (before) {
          query = query.lt("created_at", before);
        }

        const { data, error } = await query;

        if (error) throw error;

        const messages = (data as ChatMessage[]).reverse();

        setState((prev: ChatState) => ({
          messages: before ? [...prev.messages, ...messages] : messages,
          isLoading: false,
          error: null,
          hasMore: messages.length === limit,
        }));
      } catch (error) {
        setState((prev: ChatState) => ({
          ...prev,
          isLoading: false,
          error: {
            code: "load_error",
            message: "Failed to load messages",
            details: error,
          } as ChatError,
        }));
      }
    },
    []
  );

  const sendMessage = useCallback(
    async ({
      content,
      threadId,
      metadata,
    }: SendMessageParams): Promise<ChatMessage | null> => {
      try {
        const newMessage = {
          thread_id: threadId,
          content,
          role: "user" as const,
          metadata,
        };

        const { data, error } = await supabase
          .from(MESSAGES_TABLE)
          .insert([newMessage])
          .select()
          .single();

        if (error) throw error;

        const sentMessage = data as ChatMessage;

        setState((prev: ChatState) => ({
          ...prev,
          messages: [...prev.messages, sentMessage],
          error: null,
        }));

        return sentMessage;
      } catch (error) {
        setState((prev: ChatState) => ({
          ...prev,
          error: {
            code: "send_error",
            message: "Failed to send message",
            details: error,
          } as ChatError,
        }));
        return null;
      }
    },
    []
  );

  const subscribeToMessages = useCallback((threadId: string) => {
    const channel = supabase
      .channel(`messages:${threadId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: MESSAGES_TABLE,
          filter: `thread_id=eq.${threadId}`,
        },
        (payload: RealtimePostgresChangesPayload<ChatMessage>) => {
          if (!payload.new || typeof payload.new !== "object") return;

          const newMessage = payload.new as ChatMessage;
          if (newMessage.role === "assistant") {
            setState((prev: ChatState) => ({
              ...prev,
              messages: [...prev.messages, newMessage],
            }));
          }
        }
      )
      .subscribe();

    channelRef.current = channel;
  }, []);

  useEffect(() => {
    loadMessages({ threadId });
    subscribeToMessages(threadId);

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [threadId, loadMessages, subscribeToMessages]);

  const loadMoreMessages = useCallback(() => {
    if (state.messages.length === 0) return;

    const oldestMessage = state.messages[0];
    loadMessages({
      threadId,
      before: oldestMessage.created_at,
    });
  }, [threadId, state.messages, loadMessages]);

  return {
    messages: state.messages,
    isLoading: state.isLoading,
    error: state.error,
    hasMore: state.hasMore,
    sendMessage,
    loadMoreMessages,
  };
}
