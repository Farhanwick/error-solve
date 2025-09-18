import { LocalDB } from "@/lib/local-db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const db = new LocalDB()
    const user = db.getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const files = db.getFiles(user.id)
    return NextResponse.json({ files })
  } catch (error) {
    console.error("Get files error:", error)
    return NextResponse.json({ error: "Failed to get files" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const db = new LocalDB()
    const user = db.getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { fileId } = await req.json()
    db.deleteFile(fileId, user.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Delete file error:", error)
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 })
  }
}
