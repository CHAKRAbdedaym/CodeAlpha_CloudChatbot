"use client";

import { useState, useEffect } from "react";
import { MessageBubble } from "./MessageBubble";
import { ChatInput } from "./ChatInput";
import { useAutoScroll } from "@/hooks/useAutoScroll";
import { toast } from "sonner";
import { saveMessage } from "@/actions/chat";
import { createConversation } from "@/actions/conversation";
import { useRouter } from "next/navigation";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatWindowProps {
  id?: string;
  initialMessages?: Message[];
}

export function ChatWindow({ id, initialMessages = [] }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages.length > 0 
      ? initialMessages 
      : [{ role: "assistant", content: "Hello! I'm your Cloud Computing Assistant. How can I help you today with AWS, Azure, GCP, or DevOps?" }]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [currentId, setCurrentId] = useState<string | undefined>(id);
  const scrollRef = useAutoScroll<HTMLDivElement>(messages);
  const router = useRouter();

  const handleSend = async (content: string) => {
    let conversationId = currentId;

    // 1. If no conversation exists, create one
    if (!conversationId) {
      try {
        const newConv = await createConversation(content.slice(0, 30) + "...");
        conversationId = newConv.id;
        setCurrentId(newConv.id);
        // Silently update URL without reload
        window.history.pushState({}, "", `/chat/${newConv.id}`);
      } catch (err) {
        toast.error("Failed to start conversation");
        return;
      }
    }

    // 2. Save user message to DB
    try {
      await saveMessage(conversationId!, "user", content);
    } catch (err) {
      console.error("Failed to save user message");
    }

    const newUserMessage: Message = { role: "user", content };
    setMessages((prev) => [...prev, newUserMessage]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, conversationId }),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      if (!response.body) throw new Error("No response body");

      const reader = response.body.getReader();
      let assistantMessage = "";
      
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

      // 3. Save assistant message to DB after stream finishes
      try {
        await saveMessage(conversationId!, "assistant", assistantMessage);
      } catch (err) {
        console.error("Failed to save assistant message");
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
        <div className="h-40" />
      </div>
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </div>
  );
}
