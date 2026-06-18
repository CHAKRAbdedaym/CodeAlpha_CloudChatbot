import { getMessages } from "@/actions/chat";
import { ChatWindow } from "@/components/chat/ChatWindow";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";

export default async function ConversationPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  // Verify conversation exists and belongs to user (implicit in getMessages)
  const messages = await getMessages(id);
  
  if (messages.length === 0) {
    // Check if it's just an empty conversation recently created
    const exists = await prisma.conversation.findUnique({ where: { id } });
    if (!exists) notFound();
  }

  const formattedMessages = messages.map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  return <ChatWindow id={id} initialMessages={formattedMessages} />;
}
