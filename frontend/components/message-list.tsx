"use client"

import { Copy, Check, Bot, UserIcon } from "lucide-react"
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
          <h2 className="mb-2 text-2xl font-semibold">AI Translation Assistant</h2>
          <p className="text-muted-foreground">Start translating by typing a message below</p>
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

            <div
              className={cn(
                "group relative max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                message.role === "user" ? "bg-indigo-500 text-white" : "bg-muted text-foreground",
              )}
            >
              <p className="whitespace-pre-wrap break-words leading-relaxed">{message.content}</p>

              {message.role === "assistant" && (
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
