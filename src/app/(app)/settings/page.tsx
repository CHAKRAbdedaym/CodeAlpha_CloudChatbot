import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { Button } from "@/components/ui/button";
import { deleteAllConversations } from "@/actions/settings";
import { Trash2, User, Shield, Moon } from "lucide-react";
import { Separator } from "@/components/ui/separator";

export default async function SettingsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">Settings</h1>
        <p className="text-zinc-400 mt-1">Manage your account and preferences.</p>
      </div>

      <div className="grid gap-6">
        {/* Appearance */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Moon className="h-5 w-5 text-blue-500" />
              <CardTitle className="text-lg text-white">Appearance</CardTitle>
            </div>
            <CardDescription className="text-zinc-500">Customize how CloudChat looks on your screen.</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-between">
            <span className="text-sm text-zinc-300">Interface Theme</span>
            <ThemeToggle />
          </CardContent>
        </Card>

        {/* Account Info */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardHeader>
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-green-500" />
              <CardTitle className="text-lg text-white">Account Information</CardTitle>
            </div>
            <CardDescription className="text-zinc-500">Your profile details from Supabase.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between py-2">
              <span className="text-sm text-zinc-400">Email Address</span>
              <span className="text-sm text-white font-medium">{user.email}</span>
            </div>
            <Separator className="bg-zinc-800" />
            <div className="flex justify-between py-2">
              <span className="text-sm text-zinc-400">User ID</span>
              <span className="text-sm text-zinc-500 font-mono text-[10px]">{user.id}</span>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-red-900/50 bg-red-950/10">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-red-500" />
              <CardTitle className="text-lg text-red-400">Danger Zone</CardTitle>
            </div>
            <CardDescription className="text-red-900/60">Irreversible actions for your data.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-white">Clear All Conversations</p>
                <p className="text-xs text-zinc-500">This will permanently delete ALL chat history.</p>
              </div>
              <form action={deleteAllConversations}>
                <Button variant="destructive" size="sm" className="bg-red-600 hover:bg-red-700">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear Data
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
