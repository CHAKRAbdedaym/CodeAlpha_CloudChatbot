import { openrouter, SYSTEM_INSTRUCTION } from "@/lib/openrouter";
import { chatSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 2000;

async function createChatStream(content: string) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await openrouter.chat.completions.create({
        model: "google/gemma-4-26b-a4b-it:free",
        messages: [
          { role: "system", content: SYSTEM_INSTRUCTION },
          { role: "user", content },
        ],
        stream: true,
      });
      return response;
    } catch (error: any) {
      const status = error?.status ?? error?.code;
      if (status === 429 && attempt < MAX_RETRIES) {
        console.warn(`Rate limited (429), retrying in ${RETRY_DELAY_MS * attempt}ms... (attempt ${attempt}/${MAX_RETRIES})`);
        await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS * attempt));
        continue;
      }
      throw error;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const validated = chatSchema.safeParse(body);

    if (!validated.success) {
      return new Response(validated.error.message, { status: 400 });
    }

    const { content, conversationId } = validated.data;
    console.log("Chat Request received:", { content, conversationId });

    const response = await createChatStream(content);

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response!) {
            const text = chunk.choices[0]?.delta?.content || "";
            controller.enqueue(new TextEncoder().encode(text));
          }
          controller.close();
        } catch (streamError: any) {
          console.error("Stream error:", streamError);
          controller.error(streamError);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("OpenRouter API Error:", error);
    const status = error?.status ?? error?.code ?? 500;
    const message = error?.error?.message || error?.message || "Internal Server Error";
    return new Response(message, { status: typeof status === "number" ? status : 500 });
  }
}
