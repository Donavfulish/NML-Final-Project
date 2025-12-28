"use client";

import { useState } from "react";

type SentimentResult = {
  sentiment: "positive" | "neutral" | "negative";
  clean_text: string;
  insight: string;
};

export function useSentimentAnalysis() {
  const [isLoading, setIsLoading] = useState(false);

  const analyzeText = async (text: string): Promise<SentimentResult> => {
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8000/api/sentiment/text", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Failed to analyze text");
      const result = await response.json();
      console.log(result);
      return result;
    } catch (error) {
      console.error("Text analysis error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCSV = async (file: File): Promise<string> => {
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);
      console.log("vao");
      const response = await fetch("http://localhost:8000/api/sentiment/csv", {
        method: "POST",
        body: formData,
      });
      console.log("ra");
      if (!response.ok) throw new Error("Failed to analyze CSV");

      // Response is a file blob, create object URL for download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(
        new Blob([blob], { type: "text/csv;charset=utf-8;" })
      );
      return url;
    } catch (error) {
      console.error("CSV analysis error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { analyzeText, analyzeCSV, isLoading };
}
