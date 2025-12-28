"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Send, FileUp, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import type { Message, AnalysisMode } from "@/app/page"
import { useSentimentAnalysis } from "@/hooks/use-sentiment-analysis"

type ChatInputProps = {
  analysisMode: AnalysisMode
  onModeChange: (mode: AnalysisMode) => void
  onSendMessage: (userMessage: Message, assistantMessage: Message) => void
  onAddSystemMessage: (message: string) => void
}

export function ChatInput({ analysisMode, onModeChange, onSendMessage, onAddSystemMessage }: ChatInputProps) {
  const [input, setInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { analyzeText, analyzeCSV, isLoading } = useSentimentAnalysis()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading || analysisMode !== "text") return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setInput("")

    // Get sentiment analysis
    const result = await analyzeText(input.trim())

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      role: "assistant",
      content: `Sentiment: ${result.sentiment}\n\nCleaned Text: ${result.clean_text}\n\nInsight: ${result.insight}`,
      timestamp: new Date(),
      metadata: {
        sentiment: result.sentiment,
        clean_text: result.clean_text,
        insight: result.insight,
      },
    }

    onSendMessage(userMessage, assistantMessage)
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Uploaded CSV file: ${file.name}`,
      timestamp: new Date(),
    }

    try {
      const downloadUrl = await analyzeCSV(file)

      // Trigger download
      const a = document.createElement("a")
      a.href = downloadUrl
      a.download = `analyzed_${file.name}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(downloadUrl)

      onAddSystemMessage("✓ CSV analyzed successfully. File downloaded.")
      onSendMessage(userMessage, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "CSV analysis complete. The processed file has been downloaded.",
        timestamp: new Date(),
      })
    } catch (error) {
      onAddSystemMessage(`✗ Error analyzing CSV: ${error instanceof Error ? error.message : "Unknown error"}`)
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && analysisMode === "text") {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  return (
    <div className="border-t border-border bg-background px-6 py-4">
      <form onSubmit={handleSubmit} className="mx-auto max-w-3xl">
        <div className="mb-3 flex gap-2">
          <Button
            type="button"
            variant={analysisMode === "text" ? "default" : "outline"}
            onClick={() => onModeChange("text")}
            className={analysisMode === "text" ? "bg-indigo-500" : ""}
          >
            Text Analysis
          </Button>
          <Button
            type="button"
            variant={analysisMode === "csv" ? "default" : "outline"}
            onClick={() => onModeChange("csv")}
            className={analysisMode === "csv" ? "bg-indigo-500" : ""}
          >
            CSV Analysis
          </Button>
        </div>

        <div className="relative flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-lg">
          {analysisMode === "text" ? (
            <>
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Enter Vietnamese text to analyze sentiment..."
                className="min-h-[60px] resize-none border-0 bg-transparent px-3 py-3 text-base focus-visible:ring-0"
                disabled={isLoading}
              />

              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="shrink-0 rounded-xl bg-indigo-500 px-4 hover:bg-indigo-600"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                disabled={isLoading}
                className="hidden"
              />

              <div className="flex-1 px-3 py-3 text-muted-foreground">
                Click the upload button to select a CSV file with a "comment" column
              </div>

              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={isLoading}
                className="shrink-0 rounded-xl bg-indigo-500 px-4 hover:bg-indigo-600"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <FileUp className="h-5 w-5" />}
              </Button>
            </>
          )}
        </div>

        {analysisMode === "text" && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Press Enter to analyze, Shift + Enter for new line
          </p>
        )}
      </form>
    </div>
  )
}
