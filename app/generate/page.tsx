"use client"

import { useEffect, useState } from "react"
import { redirect } from "next/navigation"
import ContentGenerator from "@/components/content-generator"
import { LocalDB } from "@/lib/local-db"

export default function GeneratePage() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const db = new LocalDB()
    const currentUser = db.getCurrentUser()

    if (!currentUser) {
      redirect("/auth/login")
    } else {
      setUser(currentUser)
    }
    setLoading(false)
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-futuristic text-foreground p-4">
      <div className="max-w-4xl mx-auto py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 text-glow bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            AI Content Generator
          </h1>
          <p className="text-muted-foreground">
            Generate unlimited text, images, and code completely FREE with Red Rose AI
          </p>
        </div>

        <ContentGenerator user={user} />
      </div>
    </div>
  )
}
