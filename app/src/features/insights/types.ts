// Type definitions for insights feature
export interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
  metadata?: {
    chartSuggestions?: string[]
    confidence?: number
    sources?: string[]
  }
}

export interface InsightRequest {
  question: string
  fileId: string
  context?: Record<string, any>
}

export interface InsightResponse {
  answer: string
  confidence: number
  chartSuggestions?: string[]
  metadata?: Record<string, any>
}

export interface QuestionSuggestion {
  text: string
  category: 'revenue' | 'expenses' | 'trends' | 'comparison' | 'general'
}