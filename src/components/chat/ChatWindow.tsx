"use client";

import { useState } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { toast } from "sonner";

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
    const newUserMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      const decoder = new TextEncoder().decode(""); // Just initializing
      let assistantMessage = "";
      
      // Add empty assistant message to start streaming into it
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const text = new TextDecoder().decode(value);
        assistantMessage += text;
        
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last.role === "assistant") {
            return [...prev.slice(0, -1), { ...last, content: assistantMessage }];
          }
          return prev;
        });
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-zinc-950">
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto scrollbar-none"
      >
        <div className="max-w-4xl mx-auto py-8">
           {messages.map((m, i) => (
             <MessageBubble key={i} message={m} />
           ))}
           {isLoading && messages[messages.length - 1].role === 'user' && (
              <div className="p-6 flex gap-4 bg-zinc-900/30 border-y border-zinc-800/50">
                 <div className="flex h-8 w-8 items-center justify-center rounded-md border border-blue-500 bg-blue-600">
                   <div className="h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                 </div>
                 <div className="flex items-center text-zinc-500 italic text-sm">
                    Thinking about your cloud query...
                 </div>
              </div>
           )}
        </div>
        <div className="h-32" /> {/* Bottom spacer for input padding */}
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
