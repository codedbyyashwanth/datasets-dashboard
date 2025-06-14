// Individual chat message component with chart rendering support
import { Bot, User } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { useEffect, useRef } from 'react'
import type { Message } from '../types'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  const chartRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Render chart if message has chart data
    if (message.metadata?.chartData && chartRef.current && window.Plotly) {
      window.Plotly.purge(chartRef.current)
      
      window.Plotly.newPlot(
        chartRef.current,
        message.metadata.chartData.data,
        {
          ...message.metadata.chartData.layout,
          responsive: true,
          displayModeBar: false,
          margin: { l: 40, r: 20, t: 40, b: 40 },
          font: { size: 12 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
        },
        {
          responsive: true,
        }
      )
    }
  }, [message.metadata?.chartData])

  const renderFallbackChart = () => {
    if (!message.metadata?.chartData) return null
    
    const chartData = message.metadata.chartData
    
    if (chartData.type === 'bar' && chartData.data[0]) {
      const data = chartData.data[0]
      const maxValue = Math.max(...data.y)
      
      return (
        <div className="mt-3 p-3 bg-white rounded-lg border">
          <h4 className="text-sm font-medium mb-2">{chartData.layout.title}</h4>
          <div className="space-y-2">
            {data.x.slice(0, 5).map((label: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <div className="w-16 text-xs truncate">{label}</div>
                <div className="flex-1 bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-blue-500 h-4 rounded-full flex items-center justify-end pr-1"
                    style={{
                      width: `${(data.y[index] / maxValue) * 100}%`,
                    }}
                  >
                    <span className="text-xs text-white font-medium">
                      {data.y[index].toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="mt-3 p-3 bg-white rounded-lg border">
        <p className="text-sm text-gray-600">Chart visualization not available</p>
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex items-start space-x-2 sm:space-x-3',
        message.type === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      {message.type === 'ai' && (
        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
          <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
        </div>
      )}
      
      <Card className={cn(
        'max-w-[85%] sm:max-w-lg',
        message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gray-50'
      )}>
        <CardContent className="p-2 sm:p-3">
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {/* Chart Display */}
          {message.metadata?.chartData && (
            <>
              <div ref={chartRef} className="w-full h-64 mt-3">
                {!window.Plotly && renderFallbackChart()}
              </div>
            </>
          )}
          
          {/* Confidence Score */}
          {message.metadata?.confidence && (
            <div className="mt-2 text-xs opacity-70">
              Confidence: {Math.round(message.metadata.confidence * 100)}%
            </div>
          )}
          
          {/* Chart Suggestions */}
          {message.metadata?.chartSuggestions && message.metadata.chartSuggestions.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {message.metadata.chartSuggestions.map((suggestion, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {suggestion}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      
      {message.type === 'user' && (
        <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
        </div>
      )}
    </div>
  )
}

// Add Plotly to window type
declare global {
  interface Window {
    Plotly?: any
  }
}