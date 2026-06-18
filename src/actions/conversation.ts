"use server";

import prisma from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getConversations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  // Ensure user exists in Prisma (sync check)
  await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email! },
    create: { id: user.id, email: user.email! },
  });

  return await prisma.conversation.findMany({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
  });
}

export async function createConversation(title?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized");

  // Ensure user exists in Prisma (sync check)
  await prisma.user.upsert({
    where: { id: user.id },
    update: { email: user.email! },
    create: { id: user.id, email: user.email! },
  });

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
