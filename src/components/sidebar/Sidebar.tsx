"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  LayoutDashboard, 
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  MoreVertical,
  Pencil,
  Trash2
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth";
import { getConversations, deleteConversation, renameConversation } from "@/actions/conversation";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    async function loadConversations() {
      const data = await getConversations();
      setConversations(data);
    }
    loadConversations();
  }, [pathname]);

  const handleDelete = async (id: string) => {
    try {
      await deleteConversation(id);
      setConversations(conversations.filter(c => c.id !== id));
      toast.success("Conversation deleted");
      if (pathname === `/chat/${id}`) {
        router.push("/chat");
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  const navItems = [
    { label: "New Chat", icon: Plus, href: "/chat", primary: true },
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <aside 
      className={cn(
        "relative flex flex-col border-r border-zinc-800 bg-zinc-950 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <span className="font-bold text-xl tracking-tight text-white">CloudChat</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-400 hover:text-white"
        >
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
      </div>

      <div className="px-2 space-y-1 mt-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-3 px-3",
                item.primary && !isCollapsed && "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white",
                item.primary && isCollapsed && "bg-zinc-800",
                isCollapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}
      </div>

      {!isCollapsed && (
        <div className="mt-8 px-4 mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">History</span>
        </div>
      )}

      <ScrollArea className="flex-1 px-2 mt-2">
        <div className="flex flex-col gap-1">
          {conversations.map((conv: any) => (
            <div key={conv.id} className="group relative">
               <Link href={`/chat/${conv.id}`} className="block">
                  <Button
                    variant={pathname === `/chat/${conv.id}` ? "secondary" : "ghost"}
                    className={cn(
                      "w-auto min-w-full justify-start gap-3 px-3 text-zinc-400 group-hover:text-zinc-200 truncate",
                      isCollapsed && "justify-center px-0"
                    )}
                  >
                    <MessageSquare className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span className="truncate text-sm font-normal">{conv.title}</span>}
                  </Button>
               </Link>
               {!isCollapsed && (
                 <div className="absolute right-1 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <DropdownMenu>
                       <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-zinc-500 hover:text-white">
                             <MoreVertical className="h-4 w-4" />
                          </Button>
                       </DropdownMenuTrigger>
                       <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-300">
                          <DropdownMenuItem className="gap-2 focus:bg-zinc-800 focus:text-white">
                             <Pencil className="h-4 w-4" /> Rename
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleDelete(conv.id)}
                            className="gap-2 text-red-400 focus:bg-red-900/20 focus:text-red-400"
                          >
                             <Trash2 className="h-4 w-4" /> Delete
                          </DropdownMenuItem>
                       </DropdownMenuContent>
                    </DropdownMenu>
                 </div>
               )}
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="p-2 mt-auto border-t border-zinc-900">
         <form action={logout}>
            <Button variant="ghost" className={cn("w-full justify-start gap-3 px-3 text-zinc-400 hover:text-red-400 hover:bg-red-950/20", isCollapsed && "justify-center px-0")}>
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span className="text-sm font-medium">Log out</span>}
            </Button>
         </form>
      </div>
    </aside>
  );
}
