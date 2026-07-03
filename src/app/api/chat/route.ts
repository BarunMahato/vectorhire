import { auth } from "@/lib/auth";
import { getErrorMessage } from "@/lib/preferences";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = (await req.json()) as { message?: string };

    if (!message?.trim()) {
      return new Response("Message is required", { status: 400 });
    }

    if (!process.env.N8N_WEBHOOK_URL) {
      return new Response("N8N_WEBHOOK_URL is not configured", { status: 500 });
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const sessionId = session?.user?.id || "guest-session";

    const response = await fetch(process.env.N8N_WEBHOOK_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: message,
        sessionId,
      }),
    });

    if (!response.ok) {
      return new Response("Career assistant agent failed", { status: response.status });
    }

    if (!response.body) {
      return new Response("Career assistant returned an empty response", { status: 500 });
    }

    return new Response(response.body, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  } catch (error) {
    console.error("CHAT_AGENT_ERROR:", error);
    return new Response(getErrorMessage(error), { status: 500 });
  }
}
