import { model } from "@/lib/gemini";
import { chatSchema } from "@/lib/validations";
import { NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

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

    // TODO: Rate limiting check could go here

    const result = await model.generateContentStream(content);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const text = chunk.text();
          controller.enqueue(new TextEncoder().encode(text));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    return new Response(error.message || "Internal Server Error", { status: 500 });
  }
}
