export interface ChatMessage {
  id: string;
  thread_id: string;
  speaker_id: "user" | "assistant";
  message: string;
  created_at: string;
  updated_at: string;
  metadata?: {
    imageUrl?: string;
  };
}

export interface ChatInterfaceProps {
  threadId?: string;
  initialMessages?: ChatMessage[];
}
