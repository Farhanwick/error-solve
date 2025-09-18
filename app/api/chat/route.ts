import { LocalDB } from "@/lib/local-db"
import { type NextRequest, NextResponse } from "next/server"

export const maxDuration = 30

interface Message {
  role: "user" | "assistant"
  content: string
}

export async function POST(req: NextRequest) {
  try {
    const { messages, conversationId } = await req.json()

    const db = new LocalDB()
    const user = db.getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch("https://api-inference.huggingface.co/models/microsoft/DialoGPT-large", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Using free tier - no API key required for basic usage
      },
      body: JSON.stringify({
        inputs: messages[messages.length - 1].content,
        parameters: {
          max_length: 1000,
          temperature: 0.7,
          do_sample: true,
        },
      }),
    })

    let aiResponse =
      "I'm Red Rose AI, completely FREE and more powerful than paid alternatives! I can help you with unlimited tasks including code generation, file analysis, content creation, and full-stack development - all at zero cost. What would you like me to help you with?"

    if (response.ok) {
      const data = await response.json()
      if (data.generated_text) {
        aiResponse = data.generated_text
      }
    }

    if (conversationId) {
      db.addMessage(conversationId, user.id, "user", messages[messages.length - 1].content)
      db.addMessage(conversationId, user.id, "assistant", aiResponse)
    }

    return NextResponse.json({
      message: aiResponse,
      conversationId,
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
