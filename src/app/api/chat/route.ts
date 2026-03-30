import { auth } from "@/lib/auth"; // Path to your auth.ts
import { headers } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    // Correct way to get session in Better Auth Route Handlers
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Fallback to a generic ID if no session (or block unauthorized users)
    const sessionId = session?.user?.id || "guest-session";

    const response = await fetch(process.env.N8N_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ 
        query: message,
        sessionId: sessionId 
      }),
    });

    if (!response.body) return new Response("n8n error", { status: 500 });

    return new Response(response.body, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error(error);
    return new Response("Error", { status: 500 });
  }
}