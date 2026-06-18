"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Plus, 
  MessageSquare, 
  Settings, 
  LayoutDashboard, 
  ChevronLeft, 
  ChevronRight,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { logout } from "@/actions/auth";

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  const navItems = [
    { label: "New Chat", icon: Plus, href: "/chat", primary: true },
    { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
    { label: "Settings", icon: Settings, href: "/settings" },
  ];

  return (
    <aside 
      className={cn(
        "relative flex flex-col border-r border-zinc-800 bg-zinc-900 transition-all duration-300 ease-in-out",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <span className="font-bold text-xl tracking-tight">CloudChat</span>}
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="text-zinc-400 hover:text-white"
        >
          {isCollapsed ? <PanelLeftOpen className="h-5 w-5" /> : <PanelLeftClose className="h-5 w-5" />}
        </Button>
      </div>

      <div className="px-2 space-y-2 mt-2">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant={pathname === item.href ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start gap-2",
                item.primary && !isCollapsed && "bg-zinc-800 hover:bg-zinc-700 border border-zinc-700",
                isCollapsed && "justify-center p-0"
              )}
            >
              <item.icon className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>{item.label}</span>}
            </Button>
          </Link>
        ))}
      </div>

      <div className="mt-8 px-4 mb-2">
        {!isCollapsed && <span className="text-xs font-semibold text-zinc-500 uppercase">Recent Chats</span>}
      </div>

      <ScrollArea className="flex-1 px-2">
        {/* Chat History will go here */}
        {!isCollapsed ? (
          <div className="flex flex-col gap-1">
             {[1, 2, 3].map((i) => (
               <Button key={i} variant="ghost" className="w-full justify-start gap-2 text-zinc-400 font-normal">
                 <MessageSquare className="h-4 w-4 shrink-0" />
                 <span className="truncate text-sm">Example Cloud Setup {i}</span>
               </Button>
             ))}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            {[1, 2, 3].map((i) => (
               <MessageSquare key={i} className="h-5 w-5 text-zinc-600 my-1" />
             ))}
          </div>
        )}
      </ScrollArea>

      <div className="p-2 mt-auto border-t border-zinc-800">
         <form action={logout}>
            <Button variant="ghost" className={cn("w-full justify-start gap-2 text-zinc-400", isCollapsed && "justify-center")}>
              <LogOut className="h-5 w-5 shrink-0" />
              {!isCollapsed && <span>Logout</span>}
            </Button>
         </form>
      </div>
    </aside>
  );
}
