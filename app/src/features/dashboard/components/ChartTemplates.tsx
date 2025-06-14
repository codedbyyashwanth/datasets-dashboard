// src/features/dashboard/components/ChartTemplates.tsx
// Quick chart templates for common business scenarios
import { useState } from 'react'
import { BarChart3, LineChart, PieChart, TrendingUp, Calendar, Users, Zap } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import type { ChartConfig } from '../types'

interface ChartTemplate {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  chartType: ChartConfig['type']
  suggestedX: string[]
  suggestedY: string[]
  category: 'financial' | 'performance' | 'trend'
  color: string
}

interface ChartTemplatesProps {
  availableColumns: { all: string[], numeric: string[] }
  onCreateChart: (type: ChartConfig['type'], xAxis: string, yAxis: string) => void
  onClose: () => void
}

export function ChartTemplates({ availableColumns, onCreateChart, onClose }: ChartTemplatesProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  const templates: ChartTemplate[] = [
    {
      id: 'revenue-trend',
      name: 'Revenue Trend',
      description: 'Track revenue changes over time',
      icon: TrendingUp,
      chartType: 'line',
      suggestedX: ['date', 'month', 'quarter', 'year', 'period'],
      suggestedY: ['revenue', 'sales', 'income'],
      category: 'financial',
      color: 'blue'
    },
    {
      id: 'expense-breakdown',
      name: 'Expense Breakdown',
      description: 'Visualize expense distribution',
      icon: PieChart,
      chartType: 'pie',
      suggestedX: ['category', 'department', 'type', 'region'],
      suggestedY: ['expenses', 'cost', 'amount'],
      category: 'financial',
      color: 'orange'
    },
    {
      id: 'regional-performance',
      name: 'Regional Performance',
      description: 'Compare performance across regions',
      icon: BarChart3,
      chartType: 'bar',
      suggestedX: ['region', 'location', 'country', 'state'],
      suggestedY: ['revenue', 'sales', 'profit', 'performance'],
      category: 'performance',
      color: 'green'
    },
    {
      id: 'monthly-comparison',
      name: 'Monthly Comparison',
      description: 'Compare metrics month by month',
      icon: Calendar,
      chartType: 'bar',
      suggestedX: ['month', 'date', 'period'],
      suggestedY: ['revenue', 'sales', 'customers', 'orders'],
      category: 'trend',
      color: 'purple'
    },
    {
      id: 'customer-growth',
      name: 'Customer Growth',
      description: 'Track customer acquisition over time',
      icon: Users,
      chartType: 'line',
      suggestedX: ['date', 'month', 'quarter'],
      suggestedY: ['customers', 'users', 'customer_count'],
      category: 'performance',
      color: 'indigo'
    },
    {
      id: 'profit-analysis',
      name: 'Profit Analysis',
      description: 'Analyze profit margins and trends',
      icon: Zap,
      chartType: 'line',
      suggestedX: ['date', 'month', 'product'],
      suggestedY: ['profit', 'margin', 'net_profit'],
      category: 'financial',
      color: 'emerald'
    }
  ]

  const categories = [
    { id: 'all', label: 'All Templates', count: templates.length },
    { id: 'financial', label: 'Financial', count: templates.filter(t => t.category === 'financial').length },
    { id: 'performance', label: 'Performance', count: templates.filter(t => t.category === 'performance').length },
    { id: 'trend', label: 'Trends', count: templates.filter(t => t.category === 'trend').length }
  ]

  const filteredTemplates = selectedCategory === 'all' 
    ? templates 
    : templates.filter(t => t.category === selectedCategory)

  const findBestMatch = (template: ChartTemplate) => {
    const xMatch = template.suggestedX.find(x => 
      availableColumns.all.some(col => col.toLowerCase().includes(x.toLowerCase()))
    )
    const yMatch = template.suggestedY.find(y => 
      (template.chartType === 'pie' ? availableColumns.all : availableColumns.numeric)
        .some(col => col.toLowerCase().includes(y.toLowerCase()))
    )

    if (xMatch && yMatch) {
      const xColumn = availableColumns.all.find(col => col.toLowerCase().includes(xMatch.toLowerCase()))
      const yColumn = (template.chartType === 'pie' ? availableColumns.all : availableColumns.numeric)
        .find(col => col.toLowerCase().includes(yMatch.toLowerCase()))
      
      return { x: xColumn, y: yColumn, confidence: 'high' }
    }

    // Fallback to first available columns
    const fallbackX = availableColumns.all[0]
    const fallbackY = template.chartType === 'pie' 
      ? availableColumns.all[1] || availableColumns.all[0]
      : availableColumns.numeric[0]

    if (fallbackX && fallbackY) {
      return { x: fallbackX, y: fallbackY, confidence: 'low' }
    }

    return null
  }

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, text: string, border: string, icon: string }> = {
      blue: { bg: 'bg-blue-50', text: 'text-blue-900', border: 'border-blue-200', icon: 'text-blue-600' },
      orange: { bg: 'bg-orange-50', text: 'text-orange-900', border: 'border-orange-200', icon: 'text-orange-600' },
      green: { bg: 'bg-green-50', text: 'text-green-900', border: 'border-green-200', icon: 'text-green-600' },
      purple: { bg: 'bg-purple-50', text: 'text-purple-900', border: 'border-purple-200', icon: 'text-purple-600' },
      indigo: { bg: 'bg-indigo-50', text: 'text-indigo-900', border: 'border-indigo-200', icon: 'text-indigo-600' },
      emerald: { bg: 'bg-emerald-50', text: 'text-emerald-900', border: 'border-emerald-200', icon: 'text-emerald-600' }
    }
    return colorMap[color] || colorMap.blue
  }

  const handleTemplateClick = (template: ChartTemplate) => {
    const match = findBestMatch(template)
    if (match) {
      onCreateChart(template.chartType, match.x!, match.y!)
      onClose()
    }
  }

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Choose a Template</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="text-xs"
            >
              {category.label}
              <Badge variant="secondary" className="ml-2 h-4 text-xs">
                {category.count}
              </Badge>
            </Button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
        {filteredTemplates.map((template) => {
          const match = findBestMatch(template)
          const colors = getColorClasses(template.color)
          
          return (
            <Card 
              key={template.id} 
              className={`cursor-pointer hover:shadow-md transition-all duration-200 ${colors.border} ${
                match ? 'hover:scale-105' : 'opacity-60'
              }`}
              onClick={() => match && handleTemplateClick(template)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <template.icon className={`h-5 w-5 ${colors.icon}`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-sm font-semibold">{template.name}</CardTitle>
                    <p className="text-xs text-gray-500 mt-1">{template.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                {match ? (
                  <div className="space-y-2">
                    <div className="text-xs text-gray-600">
                      <span className="font-medium">X:</span> {match.x} • 
                      <span className="font-medium ml-1">Y:</span> {match.y}
                    </div>
                    <Badge 
                      variant={match.confidence === 'high' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {match.confidence === 'high' ? '✨ Perfect Match' : '📊 Good Fit'}
                    </Badge>
                  </div>
                ) : (
                  <div className="text-xs text-gray-400">
                    No suitable columns found for this template
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <PieChart className="h-12 w-12 mx-auto mb-2 opacity-50" />
          <p>No templates found for this category</p>
        </div>
      )}
    </div>
  )
}