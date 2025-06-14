// Enhanced metrics cards with mini charts using Recharts
import { TrendingUp, TrendingDown, DollarSign, PieChart, Target, Percent } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { formatCurrency, formatNumber } from '@/lib/utils'
import type { DashboardMetrics } from '../types'

interface MetricsCardsProps {
  metrics: DashboardMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  // Generate sample trend data for mini charts
  const generateTrendData = (baseValue: number, growth: number) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
    return months.map((month, index) => ({
      month,
      value: baseValue * (1 + (growth / 100) * (index / 5)) + Math.random() * baseValue * 0.1
    }))
  }

  const revenueData = generateTrendData(metrics.totalRevenue / 6, metrics.growthRate)
  const expenseData = generateTrendData(metrics.totalExpenses / 6, -5) // Assume expenses declining
  const profitData = generateTrendData(metrics.profit / 6, metrics.growthRate * 1.2)

  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      trend: metrics.growthRate,
      description: 'Total revenue generated',
      color: 'blue',
      data: revenueData,
      chartType: 'area' as const
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(metrics.totalExpenses),
      icon: PieChart,
      trend: -5.2, // Assuming 5.2% reduction in expenses
      description: 'Total expenses incurred',
      color: 'orange',
      data: expenseData,
      chartType: 'line' as const
    },
    {
      title: 'Net Profit',
      value: formatCurrency(metrics.profit),
      icon: metrics.profit >= 0 ? Target : TrendingDown,
      trend: metrics.profit >= 0 ? metrics.growthRate * 1.2 : metrics.growthRate,
      description: 'Revenue minus expenses',
      color: metrics.profit >= 0 ? 'green' : 'red',
      data: profitData,
      chartType: 'area' as const
    },
    {
      title: 'Growth Rate',
      value: `${metrics.growthRate.toFixed(1)}%`,
      icon: metrics.growthRate >= 0 ? TrendingUp : TrendingDown,
      trend: metrics.growthRate,
      description: 'Revenue growth rate',
      color: metrics.growthRate >= 0 ? 'green' : 'red',
      data: revenueData,
      chartType: 'line' as const
    },
  ]

  const getColorClasses = (color: string, trend?: number) => {
    const isPositive = trend === undefined ? true : trend >= 0
    
    switch (color) {
      case 'blue':
        return {
          icon: 'text-blue-600',
          bg: 'bg-blue-50',
          chart: '#3b82f6',
          badge: isPositive ? 'bg-blue-100 text-blue-800' : 'bg-blue-100 text-blue-800'
        }
      case 'green':
        return {
          icon: 'text-green-600',
          bg: 'bg-green-50',
          chart: '#10b981',
          badge: isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }
      case 'orange':
        return {
          icon: 'text-orange-600',
          bg: 'bg-orange-50',
          chart: '#f59e0b',
          badge: isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }
      case 'red':
        return {
          icon: 'text-red-600',
          bg: 'bg-red-50',
          chart: '#ef4444',
          badge: isPositive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }
      default:
        return {
          icon: 'text-gray-600',
          bg: 'bg-gray-50',
          chart: '#6b7280',
          badge: 'bg-gray-100 text-gray-800'
        }
    }
  }

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => {
        const colors = getColorClasses(card.color, card.trend)
        
        return (
          <Card key={card.title} className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${colors.bg}`}>
                <card.icon className={`h-4 w-4 ${colors.icon}`} />
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <div className="text-2xl font-bold text-gray-900" title={card.value}>
                  {card.value}
                </div>
                <p className="text-xs text-gray-500">
                  {card.description}
                </p>
              </div>

              {/* Mini Chart */}
              <div className="h-12 -mx-2">
                <ResponsiveContainer width="100%" height="100%">
                  {card.chartType === 'area' ? (
                    <AreaChart data={card.data}>
                      <Area
                        type="monotone"
                        dataKey="value"
                        stroke={colors.chart}
                        fill={colors.chart}
                        fillOpacity={0.2}
                        strokeWidth={2}
                      />
                    </AreaChart>
                  ) : (
                    <LineChart data={card.data}>
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke={colors.chart}
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  )}
                </ResponsiveContainer>
              </div>

              {/* Trend Badge */}
              {card.trend !== undefined && (
                <div className="flex items-center justify-between">
                  <Badge className={`text-xs ${colors.badge}`}>
                    <div className="flex items-center space-x-1">
                      {card.trend >= 0 ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      <span>
                        {Math.abs(card.trend).toFixed(1)}%
                      </span>
                    </div>
                  </Badge>
                  <span className="text-xs text-gray-500">vs last period</span>
                </div>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}