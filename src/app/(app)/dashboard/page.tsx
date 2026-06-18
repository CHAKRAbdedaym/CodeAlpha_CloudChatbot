import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { MessageSquare, MessagesSquare, User as UserIcon, Calendar } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const [totalConversations, totalMessages, recentConversations] = await Promise.all([
    prisma.conversation.count({ where: { userId: user.id } }),
    prisma.message.count({ 
      where: { 
        conversation: { userId: user.id },
        role: "user" 
      } 
    }),
    prisma.conversation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-zinc-400 mt-1">Overview of your cloud computing assistant activity.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard 
          title="Total Conversations" 
          value={totalConversations} 
          icon={MessageSquare} 
          description="Total chat sessions created"
        />
        <StatsCard 
          title="Total Questions" 
          value={totalMessages} 
          icon={MessagesSquare} 
          description="Total user messages sent"
        />
        <StatsCard 
          title="Account Type" 
          value="Free Tier" 
          icon={UserIcon} 
          description="Cloud Internship standard"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-1">
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <CardTitle className="text-lg font-semibold text-white">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentConversations.length > 0 ? (
                recentConversations.map((conv: any) => (
                  <Link key={conv.id} href={`/chat/${conv.id}`}>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-zinc-800 transition-colors border border-transparent hover:border-zinc-700">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-zinc-800 rounded-md">
                          <MessageSquare className="h-4 w-4 text-zinc-400" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-zinc-200">{conv.title}</p>
                          <p className="text-xs text-zinc-500">Last updated {formatDistanceToNow(new Date(conv.updatedAt))} ago</p>
                        </div>
                      </div>
                      <Calendar className="h-4 w-4 text-zinc-600" />
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  No recent activity found. Start a new chat!
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
