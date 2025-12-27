"use client"

import { useState } from "react"
import type { LanguageDirection } from "@/app/page"

const API_URL = process.env.NEXT_PUBLIC_TRANSLATE_API
  ?? "http://localhost:8000/api/translate"

export function useTranslationMock() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const translate = async (
    text: string,
    direction: LanguageDirection
  ): Promise<string> => {
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          direction,
        }),
      })

      if (!res.ok) {
        throw new Error("Translation API failed")
      }

      const data = await res.json()
      return data.translated_text
    } catch (err: any) {
      setError(err.message)
      return "Error while translating"
    } finally {
      setIsLoading(false)
    }
  }

  return { translate, isLoading, error }
}

