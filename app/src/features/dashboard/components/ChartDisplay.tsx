// Chart display component using custom CSS/SVG charts (no Plotly dependencies)
import { useEffect, useState } from 'react'
import { X, BarChart3 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import type { ChartConfig } from '../types'

interface ChartDisplayProps {
  chart: ChartConfig
  onRemove?: (chartId: string) => void
}

export function ChartDisplay({ chart, onRemove }: ChartDisplayProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Enhanced custom chart renderer (no Plotly dependencies)
  const renderCustomChart = () => {
    if (!mounted) return null
    
    if (chart.type === 'bar' && chart.data[0]) {
      const data = chart.data[0]
      if (!data.x || !data.y) return null
      
      const numericValues = data.y.filter((val: any) => typeof val === 'number' && !isNaN(val))
      const maxValue = numericValues.length > 0 ? Math.max(...numericValues) : 1
      
      return (
        <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg">
          <h4 className="text-lg font-bold mb-6 text-center text-gray-800">{chart.title}</h4>
          <div className="space-y-4">
            {data.x.slice(0, 8).map((label: string, index: number) => {
              const value = data.y[index]
              const numValue = typeof value === 'number' ? value : 0
              const percentage = maxValue > 0 ? Math.max((numValue / maxValue) * 100, 2) : 0
              
              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-28 text-sm font-semibold truncate text-gray-700" title={String(label)}>
                    {String(label)}
                  </div>
                  <div className="flex-1 bg-gray-200 rounded-full h-8 relative overflow-hidden shadow-inner">
                    <div
                      className="bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 h-8 rounded-full flex items-center justify-end pr-3 transition-all duration-1000 ease-out shadow-sm"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 20 && (
                        <span className="text-sm text-white font-bold">
                          {typeof value === 'number' ? value.toLocaleString() : value}
                        </span>
                      )}
                    </div>
                    {percentage <= 20 && (
                      <span className="absolute right-3 top-1.5 text-sm text-gray-700 font-semibold">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }
    
    if (chart.type === 'line' && chart.data[0]) {
      const data = chart.data[0]
      if (!data.x || !data.y) return null
      
      const numericValues = data.y.filter((val: any) => typeof val === 'number' && !isNaN(val))
      const maxValue = numericValues.length > 0 ? Math.max(...numericValues) : 1
      const minValue = numericValues.length > 0 ? Math.min(...numericValues) : 0
      const range = maxValue - minValue || 1
      
      // Calculate actual pixel coordinates
      const chartWidth = 400
      const chartHeight = 200
      const padding = 40
      const drawWidth = chartWidth - (padding * 2)
      const drawHeight = chartHeight - (padding * 2)
      
      const points = data.x.map((_: any, index: number) => {
        const x = padding + (index / Math.max(data.x.length - 1, 1)) * drawWidth
        const normalizedY = (data.y[index] - minValue) / range
        const y = chartHeight - padding - (normalizedY * drawHeight)
        return `${x},${y}`
      }).join(' ')
      
      return (
        <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg">
          <h4 className="text-lg font-bold mb-6 text-center text-gray-800">{chart.title}</h4>
          <div className="relative flex justify-center">
            <svg width={chartWidth} height={chartHeight} className="border border-gray-300 rounded-lg bg-white shadow-sm">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
                <line
                  key={ratio}
                  x1={padding}
                  y1={chartHeight - padding - (ratio * drawHeight)}
                  x2={chartWidth - padding}
                  y2={chartHeight - padding - (ratio * drawHeight)}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="2,2"
                />
              ))}
              
              {/* Vertical grid lines */}
              {data.x.slice(0, 6).map((_: any, index: number) => {
                const x = padding + (index / Math.max(Math.min(data.x.length, 6) - 1, 1)) * drawWidth
                return (
                  <line
                    key={index}
                    x1={x}
                    y1={padding}
                    x2={x}
                    y2={chartHeight - padding}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                )
              })}
              
              {/* Line with gradient */}
              <defs>
                <linearGradient id={`gradient-${chart.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                  <stop offset="100%" stopColor="#1d4ed8" stopOpacity="1"/>
                </linearGradient>
              </defs>
              
              <polyline
                fill="none"
                stroke={`url(#gradient-${chart.id})`}
                strokeWidth="3"
                points={points}
                style={{ filter: 'drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3))' }}
              />
              
              {/* Data points */}
              {data.x.map((_: any, index: number) => {
                const x = padding + (index / Math.max(data.x.length - 1, 1)) * drawWidth
                const normalizedY = (data.y[index] - minValue) / range
                const y = chartHeight - padding - (normalizedY * drawHeight)
                
                return (
                  <g key={index}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="#3b82f6"
                      stroke="white"
                      strokeWidth="2"
                      style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
                    />
                    {/* Hover effect circle */}
                    <circle
                      cx={x}
                      cy={y}
                      r="8"
                      fill="transparent"
                      stroke="transparent"
                      className="hover:stroke-blue-300 hover:stroke-2 transition-all duration-200"
                    />
                  </g>
                )
              })}
              
              {/* X-axis labels */}
              {data.x.slice(0, 6).map((label: string, index: number) => {
                const x = padding + (index / Math.max(Math.min(data.x.length, 6) - 1, 1)) * drawWidth
                return (
                  <text
                    key={index}
                    x={x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#6b7280"
                    fontWeight="500"
                  >
                    {String(label).length > 10 ? String(label).substring(0, 10) + '...' : String(label)}
                  </text>
                )
              })}
              
              {/* Y-axis labels */}
              {[0, 0.5, 1].map(ratio => {
                const value = minValue + (ratio * range)
                const y = chartHeight - padding - (ratio * drawHeight)
                return (
                  <text
                    key={ratio}
                    x={padding - 10}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="10"
                    fill="#6b7280"
                  >
                    {value.toFixed(0)}
                  </text>
                )
              })}
            </svg>
          </div>
        </div>
      )
    }
    
    if (chart.type === 'pie' && chart.data[0]) {
      const data = chart.data[0]
      if (!data.labels || !data.values) return null
      
      const total = data.values.reduce((sum: number, val: number) => sum + (typeof val === 'number' ? val : 0), 0)
      
      return (
        <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg">
          <h4 className="text-lg font-bold mb-6 text-center text-gray-800">{chart.title}</h4>
          <div className="space-y-3">
            {data.labels.slice(0, 8).map((label: string, index: number) => {
              const value = data.values[index]
              const numValue = typeof value === 'number' ? value : 0
              const percentage = total > 0 ? (numValue / total) * 100 : 0
              const colors = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280']
              
              return (
                <div key={index} className="flex items-center space-x-4 p-3 bg-white rounded-lg shadow-sm border">
                  <div 
                    className="w-6 h-6 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  />
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <div className="text-sm font-semibold text-gray-700 truncate" title={String(label)}>
                        {String(label)}
                      </div>
                      <div className="text-sm font-bold text-gray-900 ml-2">
                        {percentage.toFixed(1)}%
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )
    }

    if (chart.type === 'scatter' && chart.data[0]) {
      const data = chart.data[0]
      if (!data.x || !data.y) return null
      
      const xValues = data.x.filter((val: any) => typeof val === 'number' && !isNaN(val))
      const yValues = data.y.filter((val: any) => typeof val === 'number' && !isNaN(val))
      
      if (xValues.length === 0 || yValues.length === 0) {
        return (
          <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg">
            <h4 className="text-lg font-bold mb-6 text-center text-gray-800">{chart.title}</h4>
            <div className="text-center text-gray-500">
              <p>No numeric data available for scatter plot</p>
            </div>
          </div>
        )
      }
      
      const maxX = Math.max(...xValues)
      const minX = Math.min(...xValues)
      const maxY = Math.max(...yValues)
      const minY = Math.min(...yValues)
      const rangeX = maxX - minX || 1
      const rangeY = maxY - minY || 1
      
      const chartWidth = 400
      const chartHeight = 200
      const padding = 40
      const drawWidth = chartWidth - (padding * 2)
      const drawHeight = chartHeight - (padding * 2)
      
      return (
        <div className="p-6 bg-gradient-to-br from-white to-gray-50 rounded-lg">
          <h4 className="text-lg font-bold mb-6 text-center text-gray-800">{chart.title}</h4>
          <div className="relative flex justify-center">
            <svg width={chartWidth} height={chartHeight} className="border border-gray-300 rounded-lg bg-white shadow-sm">
              {/* Grid lines */}
              {[0, 0.25, 0.5, 0.75, 1].map(ratio => (
                <g key={ratio}>
                  <line
                    x1={padding}
                    y1={chartHeight - padding - (ratio * drawHeight)}
                    x2={chartWidth - padding}
                    y2={chartHeight - padding - (ratio * drawHeight)}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                  <line
                    x1={padding + (ratio * drawWidth)}
                    y1={padding}
                    x2={padding + (ratio * drawWidth)}
                    y2={chartHeight - padding}
                    stroke="#f3f4f6"
                    strokeWidth="1"
                  />
                </g>
              ))}
              
              {/* Data points */}
              {data.x.map((_: any, index: number) => {
                const xVal = Number(data.x[index])
                const yVal = Number(data.y[index])
                
                if (isNaN(xVal) || isNaN(yVal)) return null
                
                const x = padding + ((xVal - minX) / rangeX) * drawWidth
                const y = chartHeight - padding - ((yVal - minY) / rangeY) * drawHeight
                
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="4"
                    fill="#8b5cf6"
                    stroke="white"
                    strokeWidth="2"
                    opacity="0.8"
                    className="hover:r-6 hover:opacity-100 transition-all duration-200"
                    style={{ filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1))' }}
                  />
                )
              })}
            </svg>
          </div>
        </div>
      )
    }
    
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 bg-gray-50 rounded-lg">
        <BarChart3 className="h-12 w-12 mb-2" />
        <p className="text-sm">Chart type not supported</p>
        <p className="text-xs mt-1">Try a different chart type</p>
      </div>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900">{chart.title}</CardTitle>
          {onRemove && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(chart.id)}
              className="h-8 w-8 p-0 hover:bg-gray-100 transition-colors"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="min-h-[280px]">
          {renderCustomChart()}
        </div>
      </CardContent>
    </Card>
  )
}