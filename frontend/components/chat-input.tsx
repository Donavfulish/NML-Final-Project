"use client"

import type React from "react"

import { useState } from "react"
import { Send, ArrowLeftRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Message, LanguageDirection } from "@/app/page"
import { useTranslationMock } from "@/hooks/use-translation-mock"

type ChatInputProps = {
  languageDirection: LanguageDirection
  onToggleLanguage: () => void
  onSendMessage: (userMessage: Message, assistantMessage: Message) => void
}

export function ChatInput({ languageDirection, onToggleLanguage, onSendMessage }: ChatInputProps) {
  const [input, setInput] = useState("")
  const { translate, isLoading } = useTranslationMock()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setInput("")

    // Get translation
    const translatedText = await translate(input.trim(), languageDirection)

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: translatedText,
      timestamp: new Date(),
    }

    onSendMessage(userMessage, assistantMessage)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-border bg-background px-6 py-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={languageDirection === "vi-to-en" ? "Nhập văn bản tiếng Việt..." : "Type English text..."}
            className="min-h-[60px] resize-none border-0 bg-transparent px-3 py-3 text-base focus-visible:ring-0"
            disabled={isLoading}
          />

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onToggleLanguage}
              className="shrink-0 rounded-xl"
              disabled={isLoading}
            >
              <ArrowLeftRight className="h-5 w-5" />
            </Button>

            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="shrink-0 rounded-xl bg-indigo-500 px-4 hover:bg-indigo-600"
            >
              {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <p className="mt-2 text-center text-xs text-muted-foreground">
          Press Enter to send, Shift + Enter for new line
        </p>
      </form>
    </div>
  )
}
