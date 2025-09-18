import { LocalDB } from "@/lib/local-db"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    const db = new LocalDB()
    const user = db.getCurrentUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const exportData = db.exportAllData(user.id)

    const enhancedExportData = {
      export_info: {
        exported_by: "Red Rose AI - 100% FREE",
        export_date: new Date().toISOString(),
        user_id: user.id,
        user_email: user.email,
        total_conversations: exportData.conversations?.length || 0,
        total_messages: exportData.messages?.length || 0,
        total_files: exportData.files?.length || 0,
        total_generated_content: exportData.generatedContent?.length || 0,
      },
      conversations: exportData.conversations || [],
      messages: exportData.messages || [],
      files: exportData.files || [],
      generated_content: exportData.generatedContent || [],
      red_rose_ai_info: {
        platform: "Red Rose AI",
        cost: "$0.00 - Completely FREE",
        features: [
          "Unlimited AI chat",
          "Free file processing",
          "Free content generation",
          "Free data export",
          "More powerful than paid alternatives",
        ],
        message: "Thank you for using Red Rose AI - the most powerful FREE AI platform!",
      },
    }

    const downloadContent = JSON.stringify(enhancedExportData, null, 2)
    const filename = `red-rose-ai-complete-export-${new Date().toISOString().split("T")[0]}.json`

    return new NextResponse(downloadContent, {
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "X-Generated-By": "Red Rose AI - 100% FREE",
      },
    })
  } catch (error) {
    console.error("Download all data error:", error)
    return NextResponse.json({ error: "Failed to download data" }, { status: 500 })
  }
}
