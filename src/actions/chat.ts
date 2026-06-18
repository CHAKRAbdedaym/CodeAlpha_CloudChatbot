"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function getMessages(conversationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  return await prisma.message.findMany({
    where: { 
      conversationId,
      conversation: { userId: user.id }
    },
    orderBy: { createdAt: "asc" },
  });
}

export async function saveMessage(conversationId: string, role: "user" | "assistant", content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  return await prisma.message.create({
    data: {
      conversationId,
      role,
      content,
    },
  });
}
