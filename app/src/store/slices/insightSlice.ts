// Redux slice for AI insights and chat
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface Message {
  id: string
  type: 'user' | 'ai'
  content: string
  timestamp: string
  metadata?: {
    chartSuggestions?: string[]
    confidence?: number
  }
}

interface InsightState {
  messages: Message[]
  isLoading: boolean
  error: string | null
  suggestions: string[]
}

const initialState: InsightState = {
  messages: [],
  isLoading: false,
  error: null,
  suggestions: [
    "What are the top revenue drivers?",
    "Show me expense trends over time",
    "Compare performance by region",
    "What's the average customer lifetime value?",
  ],
}

const insightSlice = createSlice({
  name: 'insights',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<Omit<Message, 'id' | 'timestamp'>>) => {
      const message: Message = {
        ...action.payload,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      }
      state.messages.push(message)
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearMessages: (state) => {
      state.messages = []
    },
    updateSuggestions: (state, action: PayloadAction<string[]>) => {
      state.suggestions = action.payload
    },
  },
})

export const {
  addMessage,
  setLoading,
  setError,
  clearMessages,
  updateSuggestions,
} = insightSlice.actions

export default insightSlice.reducer