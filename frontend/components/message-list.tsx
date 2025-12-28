"use client"

import { Copy, Check, Bot, UserIcon, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Message } from "@/app/page"
import { useState } from "react"

type MessageListProps = {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const handleCopy = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <Bot className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
          <h2 className="mb-2 text-2xl font-semibold">AI Sentiment Analyzer</h2>
          <p className="text-muted-foreground">Analyze Vietnamese text or upload a CSV file to get started</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-6 py-6">
      <div className="mx-auto max-w-3xl space-y-6">
        {messages.map((message) => (
          <div key={message.id} className={cn("flex gap-4", message.role === "user" ? "justify-end" : "justify-start")}>
            {message.role === "assistant" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500/10 text-indigo-500">
                <Bot className="h-5 w-5" />
              </div>
            )}

            {message.role === "system" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/10 text-blue-500">
                <Info className="h-5 w-5" />
              </div>
            )}

            <div
              className={cn(
                "group relative max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                message.role === "user"
                  ? "bg-indigo-500 text-white"
                  : message.role === "system"
                    ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                    : "bg-muted text-foreground",
              )}
            >
              <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>

              {message.metadata?.sentiment && (
                <div className="mt-2 flex gap-2">
                  <span
                    className={cn(
                      "inline-block rounded-full px-2 py-1 text-xs font-medium",
                      message.metadata.sentiment === "positive"
                        ? "bg-green-500/20 text-green-700 dark:text-green-400"
                        : message.metadata.sentiment === "negative"
                          ? "bg-red-500/20 text-red-700 dark:text-red-400"
                          : "bg-gray-500/20 text-gray-700 dark:text-gray-400",
                    )}
                  >
                    {message.metadata.sentiment}
                  </span>
                </div>
              )}

              {message.role === "assistant" && !message.metadata?.sentiment && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -right-12 top-1 opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => handleCopy(message.content, message.id)}
                >
                  {copiedId === message.id ? (
                    <Check className="h-4 w-4 text-green-500" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>

            {message.role === "user" && (
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-500 text-white">
                <UserIcon className="h-5 w-5" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
