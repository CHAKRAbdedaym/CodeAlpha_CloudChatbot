"use client";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";
import { User, Bot, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={cn(
      "flex w-full gap-4 p-6 transition-colors",
      isUser ? "bg-transparent" : "bg-zinc-900/50 border-y border-zinc-800/50"
    )}>
      <div className={cn(
        "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border shadow",
        isUser ? "bg-white text-black border-zinc-200" : "bg-blue-600 text-white border-blue-500"
      )}>
        {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
      </div>
      <div className="flex-1 space-y-2 overflow-hidden px-1">
        <div className="prose prose-invert max-w-none break-words leading-7 text-zinc-300">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code({ node, inline, className, children, ...props }: any) {
                const match = /language-(\w+)/.exec(className || "");
                return !inline && match ? (
                  <div className="relative group my-4">
                     <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" onClick={() => {
                           navigator.clipboard.writeText(String(children));
                           toast.success("Code copied");
                        }} className="h-8 w-8 bg-zinc-800 hover:bg-zinc-700">
                           <Copy className="h-4 w-4" />
                        </Button>
                     </div>
                     <SyntaxHighlighter
                        {...props}
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        className="rounded-lg !bg-zinc-950 !p-4 !m-0 border border-zinc-800"
                     >
                        {String(children).replace(/\n$/, "")}
                     </SyntaxHighlighter>
                  </div>
                ) : (
                  <code className={cn("bg-zinc-800 rounded px-1.5 py-0.5 font-mono text-sm", className)} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {message.content}
          </ReactMarkdown>
        </div>
        {!isUser && (
           <div className="mt-2 flex items-center justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={copyToClipboard}
                className="text-zinc-500 hover:text-zinc-300 h-8 px-2"
              >
                {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                {copied ? "Copied" : "Copy"}
              </Button>
           </div>
        )}
      </div>
    </div>
  );
}
