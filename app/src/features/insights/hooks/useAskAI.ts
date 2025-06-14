// Updated custom hook with chart support
import { useState, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { RootState } from '@/store'
import { addMessage, setLoading, setError } from '@/store/slices/insightSlice'
import { insightService } from '@/services/insightService'

export function useAskAI() {
  const dispatch = useDispatch()
  const { messages, isLoading, error } = useSelector((state: RootState) => state.insights)
  const { activeFileId } = useSelector((state: RootState) => state.dashboard)

  const askQuestion = useCallback(async (question: string) => {
    if (!activeFileId) {
      dispatch(setError('Please select a dataset first'))
      return
    }

    // Add user message
    dispatch(addMessage({
      type: 'user',
      content: question,
    }))

    dispatch(setLoading(true))
    dispatch(setError(null))

    try {
      const response = await insightService.askQuestion({
        question,
        fileId: activeFileId,
      })

      // Add AI response with potential chart data
      dispatch(addMessage({
        type: 'ai',
        content: response.answer,
        metadata: {
          confidence: response.confidence,
          chartSuggestions: response.chartSuggestions,
          chartData: response.chartData,
        },
      }))
    } catch (error) {
      dispatch(setError('Failed to get AI response. Please try again.'))
      console.error('AI request failed:', error)
    } finally {
      dispatch(setLoading(false))
    }
  }, [dispatch, activeFileId])

  return {
    messages,
    isLoading,
    error,
    askQuestion,
  }
}