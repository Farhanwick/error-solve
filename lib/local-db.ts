interface User {
  id: string
  email: string
  created_at: string
}

interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
}

interface Message {
  id: string
  conversation_id: string
  content: string
  sender: "user" | "ai"
  created_at: string
}

interface FileUpload {
  id: string
  user_id: string
  filename: string
  file_type: string
  file_size: number
  content?: string
  analysis?: string
  created_at: string
}

interface GeneratedContent {
  id: string
  user_id: string
  type: "text" | "image" | "code"
  prompt: string
  content: string
  created_at: string
}

export class LocalDB {
  private getStorageKey(table: string): string {
    return `red_rose_ai_${table}`
  }

  private generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9)
  }

  // User management
  getCurrentUser(): User | null {
    const userData = localStorage.getItem(this.getStorageKey("current_user"))
    return userData ? JSON.parse(userData) : null
  }

  signIn(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user: User = {
          id: this.generateId(),
          email,
          created_at: new Date().toISOString(),
        }
        localStorage.setItem(this.getStorageKey("current_user"), JSON.stringify(user))
        resolve({ user, error: null })
      }, 500)
    })
  }

  signUp(email: string, password: string): Promise<{ user: User | null; error: string | null }> {
    return this.signIn(email, password) // Same as sign in for demo
  }

  signOut(): Promise<void> {
    return new Promise((resolve) => {
      localStorage.removeItem(this.getStorageKey("current_user"))
      resolve()
    })
  }

  // Conversations
  getConversations(userId: string): Conversation[] {
    const conversations = JSON.parse(localStorage.getItem(this.getStorageKey("conversations")) || "[]")
    return conversations.filter((c: Conversation) => c.user_id === userId)
  }

  createConversation(userId: string, title: string): Conversation {
    const conversation: Conversation = {
      id: this.generateId(),
      user_id: userId,
      title,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const conversations = JSON.parse(localStorage.getItem(this.getStorageKey("conversations")) || "[]")
    conversations.push(conversation)
    localStorage.setItem(this.getStorageKey("conversations"), JSON.stringify(conversations))
    return conversation
  }

  // Messages
  getMessages(conversationId: string, userId: string): Message[] {
    const messages = JSON.parse(localStorage.getItem(this.getStorageKey("messages")) || "[]")
    return messages.filter((m: Message) => m.conversation_id === conversationId)
  }

  addMessage(conversationId: string, userId: string, role: "user" | "assistant", content: string): Message {
    const message: Message = {
      id: this.generateId(),
      conversation_id: conversationId,
      content,
      sender: role === "assistant" ? "ai" : "user",
      created_at: new Date().toISOString(),
    }

    const messages = JSON.parse(localStorage.getItem(this.getStorageKey("messages")) || "[]")
    messages.push(message)
    localStorage.setItem(this.getStorageKey("messages"), JSON.stringify(messages))
    return message
  }

  // File uploads
  getFiles(userId: string): FileUpload[] {
    const files = JSON.parse(localStorage.getItem(this.getStorageKey("files")) || "[]")
    return files.filter((f: FileUpload) => f.user_id === userId)
  }

  createFile(
    userId: string,
    filename: string,
    fileType: string,
    fileSize: number,
    content?: string,
    analysis?: string,
  ): FileUpload {
    const file: FileUpload = {
      id: this.generateId(),
      user_id: userId,
      filename,
      file_type: fileType,
      file_size: fileSize,
      content,
      analysis,
      created_at: new Date().toISOString(),
    }

    const files = JSON.parse(localStorage.getItem(this.getStorageKey("files")) || "[]")
    files.push(file)
    localStorage.setItem(this.getStorageKey("files"), JSON.stringify(files))
    return file
  }

  deleteFile(fileId: string, userId: string): boolean {
    const files = JSON.parse(localStorage.getItem(this.getStorageKey("files")) || "[]")
    const filteredFiles = files.filter((f: FileUpload) => !(f.id === fileId && f.user_id === userId))
    localStorage.setItem(this.getStorageKey("files"), JSON.stringify(filteredFiles))
    return true
  }

  // Generated content
  getGeneratedContent(userId: string): GeneratedContent[] {
    const content = JSON.parse(localStorage.getItem(this.getStorageKey("generated_content")) || "[]")
    return content.filter((c: GeneratedContent) => c.user_id === userId)
  }

  createGeneratedContent(
    userId: string,
    type: "text" | "image" | "code",
    prompt: string,
    content: string,
    resultData?: any,
    resultUrl?: string,
  ): GeneratedContent {
    const generatedContent: GeneratedContent = {
      id: this.generateId(),
      user_id: userId,
      type,
      prompt,
      content,
      created_at: new Date().toISOString(),
    }

    const allContent = JSON.parse(localStorage.getItem(this.getStorageKey("generated_content")) || "[]")
    allContent.push(generatedContent)
    localStorage.setItem(this.getStorageKey("generated_content"), JSON.stringify(allContent))
    return generatedContent
  }

  getGeneratedContentById(contentId: string, userId: string): GeneratedContent | null {
    const content = this.getGeneratedContent(userId)
    return content.find((c) => c.id === contentId) || null
  }

  // Export all user data
  exportAllData(userId: string): any {
    const conversations = this.getConversations(userId)
    const messages = JSON.parse(localStorage.getItem(this.getStorageKey("messages")) || "[]")
    const files = this.getFiles(userId)
    const generatedContent = this.getGeneratedContent(userId)

    const exportData = {
      user: this.getCurrentUser(),
      conversations,
      messages: messages.filter((m: Message) => conversations.some((c) => c.id === m.conversation_id)),
      files,
      generatedContent,
      exportedAt: new Date().toISOString(),
    }

    return exportData
  }
}

export const localDB = new LocalDB()
