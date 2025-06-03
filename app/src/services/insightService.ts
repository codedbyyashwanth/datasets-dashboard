// Service for AI-powered insights and natural language queries
import apiClient from './apiClient'

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

class InsightService {
  async askQuestion(request: InsightRequest): Promise<InsightResponse> {
    // Mock AI response for demo
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockResponses = [
          {
            answer: "Based on your data analysis, I can see that Q4 revenue shows a 23% increase compared to Q3, with the strongest growth in the Technology and Healthcare sectors. The main drivers appear to be increased customer acquisition and higher average order values.",
            confidence: 0.89,
            chartSuggestions: ['revenue_by_quarter', 'sector_performance'],
          },
          {
            answer: "The expense trends indicate a 15% reduction in operational costs over the past 6 months, primarily due to automation initiatives and vendor renegotiations. Marketing spend has increased by 8% but shows strong ROI.",
            confidence: 0.92,
            chartSuggestions: ['expense_trends', 'cost_breakdown'],
          },
          {
            answer: "Customer lifetime value has improved to $2,340 on average, with premium tier customers showing the highest retention rates at 94%. The data suggests focusing on upselling strategies for mid-tier customers.",
            confidence: 0.85,
            chartSuggestions: ['clv_by_tier', 'retention_rates'],
          },
        ]
        
        const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)]
        resolve(randomResponse)
      }, 1500)
    })
  }

  async getSuggestions(fileId: string): Promise<string[]> {
    // Mock suggestions based on file content
    return [
      "What are the key performance indicators?",
      "Show me the revenue breakdown by category",
      "Which products have the highest profit margins?",
      "What's the customer acquisition cost trend?",
    ]
  }
}

export const insightService = new InsightService()