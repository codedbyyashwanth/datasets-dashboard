// Chart display component using Plotly
import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChartConfig } from '../types'

interface ChartDisplayProps {
  chart: ChartConfig
  onRemove?: (chartId: string) => void
}

export function ChartDisplay({ chart, onRemove }: ChartDisplayProps) {
  const plotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (plotRef.current && window.Plotly) {
      // Clear any existing plot
      window.Plotly.purge(plotRef.current)
      
      // Create new plot
      window.Plotly.newPlot(
        plotRef.current,
        chart.data,
        {
          ...chart.layout,
          responsive: true,
          displayModeBar: false,
        },
        {
          responsive: true,
        }
      )
    }
  }, [chart])

  // Fallback chart using HTML/CSS if Plotly is not available
  const renderFallbackChart = () => {
    if (chart.type === 'bar' && chart.data[0]) {
      const data = chart.data[0]
      const maxValue = Math.max(...data.y)
      
      return (
        <div className="space-y-2">
          {data.x.map((label: string, index: number) => (
            <div key={index} className="flex items-center space-x-2">
              <div className="w-20 text-sm truncate">{label}</div>
              <div className="flex-1 bg-gray-200 rounded-full h-6">
                <div
                  className="bg-primary h-6 rounded-full flex items-center justify-end pr-2"
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
      )
    }
    
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        Chart visualization not available
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{chart.title}</CardTitle>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(chart.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div ref={plotRef} className="w-full h-64">
          {!window.Plotly && renderFallbackChart()}
        </div>
      </CardContent>
    </Card>
  )
}

// Add Plotly to window type
declare global {
  interface Window {
    Plotly?: any
  }
}