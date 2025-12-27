"use client"

import { PanelLeft, Plus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Message } from "@/app/page"

type SidebarProps = {
  isOpen: boolean
  onToggle: () => void
  onNewChat: () => void
  messages: Message[]
}

export function Sidebar({ isOpen, onToggle, onNewChat, messages }: SidebarProps) {
  // Group messages by date for history
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(yesterday.getDate() - 1)

  const todayMessages = messages.filter((msg) => {
    const msgDate = new Date(msg.timestamp)
    return msgDate.toDateString() === today.toDateString()
  })

  const yesterdayMessages = messages.filter((msg) => {
    const msgDate = new Date(msg.timestamp)
    return msgDate.toDateString() === yesterday.toDateString()
  })

  return (
    <>
      {/* Toggle Button (visible when sidebar is closed) */}
      {!isOpen && (
        <Button variant="ghost" size="icon" onClick={onToggle} className="absolute left-4 top-4 z-10">
          <PanelLeft className="h-5 w-5" />
        </Button>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex h-screen w-64 flex-col border-r border-border bg-sidebar text-sidebar-foreground transition-transform duration-300",
          !isOpen && "-translate-x-full",
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between border-b border-sidebar-border p-4">
          <h2 className="text-lg font-semibold">Translation History</h2>
          <Button variant="ghost" size="icon" onClick={onToggle}>
            <PanelLeft className="h-5 w-5" />
          </Button>
        </div>

        {/* New Chat Button */}
        <div className="p-3">
          <Button
            onClick={onNewChat}
            className="w-full justify-start gap-2 bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90"
          >
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <MessageSquare className="mb-2 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">No translation history yet</p>
            </div>
          ) : (
            <>
              {todayMessages.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Today</h3>
                  {todayMessages
                    .filter((msg) => msg.role === "user")
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className="mb-1 cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <p className="truncate">{msg.content}</p>
                      </div>
                    ))}
                </div>
              )}

              {yesterdayMessages.length > 0 && (
                <div className="mb-4">
                  <h3 className="mb-2 px-3 text-xs font-semibold text-muted-foreground">Yesterday</h3>
                  {yesterdayMessages
                    .filter((msg) => msg.role === "user")
                    .map((msg) => (
                      <div
                        key={msg.id}
                        className="mb-1 cursor-pointer rounded-lg px-3 py-2 text-sm hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      >
                        <p className="truncate">{msg.content}</p>
                      </div>
                    ))}
                </div>
              )}
            </>
          )}
        </div>
      </aside>
    </>
  )
}
