"use client";

import { useState } from "react";
import { login, signup } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function AuthForm({ type }: { type: "login" | "signup" }) {
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    const result = type === "login" ? await login(formData) : await signup(formData);
    
    if (result?.error) {
      toast.error(result.error);
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full max-w-md border-zinc-800 bg-zinc-950/50 backdrop-blur-xl">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold tracking-tight text-white">
          {type === "login" ? "Welcome back" : "Create an account"}
        </CardTitle>
        <CardDescription className="text-zinc-400">
          {type === "login" 
            ? "Enter your email to sign in to your account" 
            : "Enter your email below to create your account"}
        </CardDescription>
      </CardHeader>
      <form action={handleSubmit}>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email" className="text-zinc-300">Email</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="m@example.com" 
              required 
              className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password" className="text-zinc-300">Password</Label>
            <Input 
              id="password" 
              name="password" 
              type="password" 
              required 
              className="border-zinc-800 bg-zinc-900 text-white placeholder:text-zinc-500 focus-visible:ring-zinc-700"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button 
            className="w-full bg-white text-black hover:bg-zinc-200" 
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {type === "login" ? "Sign In" : "Sign Up"}
          </Button>
          <div className="text-center text-sm text-zinc-400">
            {type === "login" ? (
              <>
                Don't have an account?{" "}
                <Link href="/signup" className="text-white underline underline-offset-4 hover:text-zinc-200">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <Link href="/login" className="text-white underline underline-offset-4 hover:text-zinc-200">
                  Login
                </Link>
              </>
            )}
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
