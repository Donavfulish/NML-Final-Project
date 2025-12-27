"use client"

import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { MessageList } from "@/components/message-list"
import { ChatInput } from "@/components/chat-input"
import { ThemeToggle } from "@/components/theme-toggle"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export type LanguageDirection = "vi-to-en" | "en-to-vi"

export default function TranslationChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [languageDirection, setLanguageDirection] = useState<LanguageDirection>("vi-to-en")
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const handleSendMessage = (userMessage: Message, assistantMessage: Message) => {
    setMessages((prev) => [...prev, userMessage, assistantMessage])
  }

  const toggleLanguageDirection = () => {
    setLanguageDirection((prev) => (prev === "vi-to-en" ? "en-to-vi" : "vi-to-en"))
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
            <h1 className="text-xl font-semibold">AI Translator</h1>
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-500 dark:bg-indigo-500/20">
              {languageDirection === "vi-to-en" ? "Vietnamese → English" : "English → Vietnamese"}
            </span>
          </div>
          <ThemeToggle />
        </header>

        {/* Main Chat Area */}
        <MessageList messages={messages} />

        {/* Input Area */}
        <ChatInput
          languageDirection={languageDirection}
          onToggleLanguage={toggleLanguageDirection}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  )
}
