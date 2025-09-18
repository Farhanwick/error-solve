import { LocalDB } from "@/lib/local-db"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const db = new LocalDB()
    const user = db.getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { title } = await req.json()
    const conversation = db.createConversation(user.id, title || "New Conversation")

    return NextResponse.json({ conversation })
  } catch (error) {
    console.error("Create conversation error:", error)
    return NextResponse.json({ error: "Failed to create conversation" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const db = new LocalDB()
    const user = db.getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const conversations = db.getConversations(user.id)
    return NextResponse.json({ conversations })
  } catch (error) {
    console.error("Get conversations error:", error)
    return NextResponse.json({ error: "Failed to get conversations" }, { status: 500 })
  }
}
