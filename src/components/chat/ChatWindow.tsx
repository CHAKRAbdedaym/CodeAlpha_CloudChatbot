"use client";

import { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function ChatWindow() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! I'm your Cloud Computing Assistant. How can I help you today with AWS, Azure, GCP, or DevOps?" }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useAutoScroll<HTMLDivElement>(messages);

  const handleSend = async (content: string) => {
    // Optimistic UI
    const newUserMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    // Call API (will implement in next phase)
    setTimeout(() => {
       setMessages((prev) => [...prev, { role: "assistant", content: "This is a placeholder response. Gemini streaming will be integrated in the next phase." }]);
       setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-800"
      >
        <div className="max-w-4xl mx-auto py-8">
           {messages.map((m, i) => (
             <MessageBubble key={i} message={m} />
           ))}
           {isLoading && (
              <div className="p-6 flex gap-4 bg-zinc-900/30">
                 <div className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-500 bg-blue-600">
                   <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                 </div>
                 <div className="flex items-center text-zinc-500 italic text-sm">
                    Thinking about your cloud query...
                 </div>
              </div>
           )}
        </div>
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
