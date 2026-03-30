"use server";

export async function sendMessageToAI(message: string) {
  const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL;

  try {
    const response = await fetch(N8N_WEBHOOK_URL!, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: message }),
    });

    if (!response.ok) throw new Error("Failed to fetch from n8n");

    const data = await response.json();
    // Assuming your n8n 'Respond to Webhook' node returns { output: "..." }
    return data.output || "I'm sorry, I couldn't process that.";
  } catch (error) {
    console.error("Chat Error:", error);
    return "Error connecting to the assistant. Check your n8n workflow.";
  }
}