// Fixed chart display component with proper Plotly integration
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
    if (plotRef.current) {
      // Clear any existing plot first
      if (window.Plotly) {
        window.Plotly.purge(plotRef.current)
        
        // Create a deep copy of the data to avoid read-only property errors
        const plotData = JSON.parse(JSON.stringify(chart.data))
        const plotLayout = {
          ...chart.layout,
          responsive: true,
          displayModeBar: false,
          margin: { l: 50, r: 20, t: 40, b: 40 },
          font: { size: 12 },
          paper_bgcolor: 'rgba(0,0,0,0)',
          plot_bgcolor: 'rgba(0,0,0,0)',
        }
        
        // Create new plot
        window.Plotly.newPlot(
          plotRef.current,
          plotData,
          plotLayout,
          {
            responsive: true,
            displaylogo: false,
            modeBarButtonsToRemove: ['toImage'],
          }
        ).catch((error: any) => {
          console.error('Plotly error:', error)
        })
      } else {
        // Fallback if Plotly is not loaded
        console.warn('Plotly not loaded, showing fallback chart')
      }
    }
  }, [chart])

  // Enhanced fallback chart rendering
  const renderFallbackChart = () => {
    if (chart.type === 'bar' && chart.data[0]) {
      const data = chart.data[0]
      const maxValue = Math.max(...data.y)
      
      return (
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3 text-center">{chart.title}</h4>
          <div className="space-y-3">
            {data.x.map((label: string, index: number) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-24 text-sm font-medium truncate" title={label}>
                  {label}
                </div>
                <div className="flex-1 bg-gray-200 rounded-full h-6 relative">
                  <div
                    className="bg-blue-500 h-6 rounded-full flex items-center justify-end pr-2 transition-all duration-500"
                    style={{
                      width: `${Math.max((data.y[index] / maxValue) * 100, 5)}%`,
                    }}
                  >
                    <span className="text-xs text-white font-medium">
                      {typeof data.y[index] === 'number' ? data.y[index].toLocaleString() : data.y[index]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    
    if (chart.type === 'line' && chart.data[0]) {
      const data = chart.data[0]
      const maxValue = Math.max(...data.y)
      const minValue = Math.min(...data.y)
      const range = maxValue - minValue
      
      return (
        <div className="p-4">
          <h4 className="text-sm font-medium mb-3 text-center">{chart.title}</h4>
          <div className="relative h-48 border rounded bg-gray-50 p-4">
            <svg width="100%" height="100%" className="overflow-visible">
              <polyline
                fill="none"
                stroke="#3b82f6"
                strokeWidth="2"
                points={data.x.map((_, index: number) => {
                  const x = (index / (data.x.length - 1)) * 100
                  const y = 100 - ((data.y[index] - minValue) / range) * 100
                  return `${x}%,${y}%`
                }).join(' ')}
              />
              {data.x.map((label: string, index: number) => {
                const x = (index / (data.x.length - 1)) * 100
                const y = 100 - ((data.y[index] - minValue) / range) * 100
                return (
                  <g key={index}>
                    <circle cx={`${x}%`} cy={`${y}%`} r="3" fill="#3b82f6" />
                    <text x={`${x}%`} y="100%" dy="1em" textAnchor="middle" fontSize="10" fill="#666">
                      {label}
                    </text>
                  </g>
                )
              })}
            </svg>
          </div>
        </div>
      )
    }
    
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        <div className="text-center">
          <p className="text-sm">Chart visualization not available</p>
          <p className="text-xs mt-1">Plotly.js not loaded</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{chart.title}</CardTitle>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(chart.id)}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="relative">
          <div ref={plotRef} className="w-full h-64">
            {/* Fallback chart will be shown if Plotly fails to load */}
          </div>
          {/* Always render fallback as backup */}
          <div className="w-full h-64 absolute top-0 left-0" style={{ 
            display: window.Plotly ? 'none' : 'block' 
          }}>
            {renderFallbackChart()}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Extend window interface for Plotly
declare global {
  interface Window {
    Plotly?: any
  }
}