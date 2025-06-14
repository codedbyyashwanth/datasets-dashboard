// Enhanced service for AI-powered insights with chart generation
import apiClient from './apiClient'

export interface InsightRequest {
  question: string
  fileId: string
  context?: Record<string, any>
}

export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'scatter'
  data: any[]
  layout: any
}

export interface InsightResponse {
  answer: string
  confidence: number
  chartSuggestions?: string[]
  chartData?: ChartData
  metadata?: Record<string, any>
}

class InsightService {
  async askQuestion(request: InsightRequest): Promise<InsightResponse> {
    // In a real app, this would call your backend API
    // For demo purposes, we'll simulate responses with chart data
    
    return new Promise((resolve) => {
      setTimeout(() => {
        const question = request.question.toLowerCase()
        
        // Determine if question requests a chart
        const isChartRequest = question.includes('chart') || 
                              question.includes('show') || 
                              question.includes('graph') || 
                              question.includes('plot') ||
                              question.includes('visualize')

        let response: InsightResponse

        if (isChartRequest || question.includes('revenue') || question.includes('trend')) {
          // Generate chart data for revenue trends
          response = {
            answer: "Based on your data analysis, here's the revenue trend over time. The chart shows steady growth with some seasonal variations in Q4.",
            confidence: 0.92,
            chartSuggestions: ['revenue_by_month', 'regional_breakdown'],
            chartData: {
              type: 'line',
              data: [{
                x: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                y: [125000, 132000, 145000, 138000, 156000, 162000],
                type: 'scatter',
                mode: 'lines+markers',
                name: 'Revenue',
                line: { color: '#3b82f6', width: 3 },
                marker: { size: 8 }
              }],
              layout: {
                title: 'Revenue Trend Over Time',
                xaxis: { title: 'Month' },
                yaxis: { title: 'Revenue ($)' },
                showlegend: false,
              }
            }
          }
        } else if (question.includes('expense') || question.includes('cost')) {
          // Generate chart data for expenses
          response = {
            answer: "Your expense breakdown shows that operational costs represent the largest category, followed by marketing and administrative expenses.",
            confidence: 0.88,
            chartSuggestions: ['expense_breakdown', 'cost_trends'],
            chartData: {
              type: 'bar',
              data: [{
                x: ['Operations', 'Marketing', 'Admin', 'R&D', 'Sales'],
                y: [45000, 25000, 18000, 15000, 12000],
                type: 'bar',
                marker: { color: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'] }
              }],
              layout: {
                title: 'Expense Breakdown by Category',
                xaxis: { title: 'Category' },
                yaxis: { title: 'Amount ($)' },
                showlegend: false,
              }
            }
          }
        } else if (question.includes('region') || question.includes('performance')) {
          // Generate chart data for regional performance
          response = {
            answer: "Regional performance analysis shows North America leading in revenue, followed by Europe and Asia Pacific. The growth rates vary significantly across regions.",
            confidence: 0.85,
            chartSuggestions: ['regional_revenue', 'growth_comparison'],
            chartData: {
              type: 'bar',
              data: [{
                x: ['North America', 'Europe', 'Asia Pacific'],
                y: [450000, 320000, 230000],
                type: 'bar',
                marker: { color: '#10b981' }
              }],
              layout: {
                title: 'Revenue by Region',
                xaxis: { title: 'Region' },
                yaxis: { title: 'Revenue ($)' },
                showlegend: false,
              }
            }
          }
        } else {
          // Default text-only response
          const mockResponses = [
            {
              answer: "Based on your data analysis, I can see that Q4 revenue shows a 23% increase compared to Q3, with the strongest growth in the Technology and Healthcare sectors. The main drivers appear to be increased customer acquisition and higher average order values.",
              confidence: 0.89,
              chartSuggestions: ['revenue_by_quarter', 'sector_performance'],
            },
            {
              answer: "The data indicates a 15% reduction in operational costs over the past 6 months, primarily due to automation initiatives and vendor renegotiations. Marketing spend has increased by 8% but shows strong ROI.",
              confidence: 0.92,
              chartSuggestions: ['expense_trends', 'cost_breakdown'],
            },
            {
              answer: "Customer lifetime value has improved to $2,340 on average, with premium tier customers showing the highest retention rates at 94%. The data suggests focusing on upselling strategies for mid-tier customers.",
              confidence: 0.85,
              chartSuggestions: ['clv_by_tier', 'retention_rates'],
            },
          ]
          
          response = mockResponses[Math.floor(Math.random() * mockResponses.length)]
        }
        
        resolve(response)
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
      "Create a chart showing monthly revenue trends",
      "Visualize expense distribution by department",
    ]
  }
}

export const insightService = new InsightService()