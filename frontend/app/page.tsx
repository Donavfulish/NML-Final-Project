"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MessageList } from "@/components/message-list"
import { ChatInput } from "@/components/chat-input"
import { ThemeToggle } from "@/components/theme-toggle"

export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  timestamp: Date
  metadata?: {
    sentiment?: "positive" | "neutral" | "negative"
    clean_text?: string
    insight?: string
  }
}

export type AnalysisMode = "text" | "csv"

export default function SentimentAnalyzer() {
  const [messages, setMessages] = useState<Message[]>([])
  const [analysisMode, setAnalysisMode] = useState<AnalysisMode>("text")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleSendMessage = (userMessage: Message, assistantMessage: Message) => {
    setMessages((prev) => [...prev, userMessage, assistantMessage])
  }

  const handleAddSystemMessage = (message: string) => {
    const systemMessage: Message = {
      id: Date.now().toString(),
      role: "system",
      content: message,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, systemMessage])
  }

  const handleNewChat = () => {
    setMessages([])
  }

  return (
    <div className="flex h-screen bg-background text-foreground">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onNewChat={handleNewChat}
        messages={messages}
      />

      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">AI Sentiment Analyzer</h1>
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-500 dark:bg-indigo-500/20">
              {analysisMode === "text" ? "Text Analysis" : "CSV Analysis"}
            </span>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Chat Area */}
        <MessageList messages={messages} />

        {/* Input Area */}
        <ChatInput
          analysisMode={analysisMode}
          onModeChange={setAnalysisMode}
          onSendMessage={handleSendMessage}
          onAddSystemMessage={handleAddSystemMessage}
        />
      </div>
    </div>
  )
}
