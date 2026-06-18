"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getConversations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  return await prisma.conversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createConversation(title?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  const conversation = await prisma.conversation.create({
    data: {
      userId: user.id,
      title: title || "New Cloud Chat",
    },
  });

  revalidatePath("/");
  return conversation;
}

export async function renameConversation(id: string, title: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await prisma.conversation.update({
    where: { id, userId: user.id },
    data: { title },
  });

  revalidatePath("/");
}

export async function deleteConversation(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  await prisma.conversation.delete({
    where: { id, userId: user.id },
  });

  revalidatePath("/");
}
