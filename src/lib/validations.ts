import { z } from "zod";

export const authSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const chatSchema = z.object({
  content: z.string().min(1, "Message cannot be empty"),
  conversationId: z.string().optional(),
});
