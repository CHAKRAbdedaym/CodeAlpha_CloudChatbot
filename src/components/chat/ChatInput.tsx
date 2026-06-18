"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { SendHorizontal, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSend, isLoading }: ChatInputProps) {
  const [input, setInput] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !isLoading) {
      onSend(input);
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 border-t border-zinc-800 bg-zinc-950/50 backdrop-blur-md">
      <form 
        onSubmit={handleSubmit} 
        className="max-w-4xl mx-auto relative flex items-end gap-2 bg-zinc-900 border border-zinc-800 rounded-xl p-2 focus-within:border-zinc-700 transition-colors"
      >
        <textarea
          ref={textareaRef}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask anything about Cloud Computing..."
          className="flex-1 bg-transparent border-none focus:ring-0 text-zinc-100 placeholder:text-zinc-500 resize-none max-h-60 p-2 text-base leading-6"
        />
        <Button 
          type="submit" 
          disabled={!input.trim() || isLoading}
          size="icon"
          className="bg-white text-black hover:bg-zinc-200 rounded-lg shrink-0 h-10 w-10 mb-0.5"
        >
          {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <SendHorizontal className="h-5 w-5" />}
        </Button>
      </form>
      <p className="text-[10px] text-center mt-2 text-zinc-600">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
