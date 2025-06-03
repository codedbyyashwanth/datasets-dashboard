// Dashboard metrics display cards
import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { formatCurrency, formatNumber } from '../../../lib/utils'
import type { DashboardMetrics } from '../types'

interface MetricsCardsProps {
  metrics: DashboardMetrics
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: 'Total Revenue',
      value: formatCurrency(metrics.totalRevenue),
      icon: DollarSign,
      trend: metrics.growthRate,
      description: 'Total revenue generated',
    },
    {
      title: 'Total Expenses',
      value: formatCurrency(metrics.totalExpenses),
      icon: PieChart,
      description: 'Total expenses incurred',
    },
    {
      title: 'Net Profit',
      value: formatCurrency(metrics.profit),
      icon: metrics.profit >= 0 ? TrendingUp : TrendingDown,
      trend: metrics.profit >= 0 ? 'positive' : 'negative',
      description: 'Revenue minus expenses',
    },
    {
      title: 'Growth Rate',
      value: `${metrics.growthRate.toFixed(1)}%`,
      icon: metrics.growthRate >= 0 ? TrendingUp : TrendingDown,
      trend: metrics.growthRate >= 0 ? 'positive' : 'negative',
      description: 'Revenue growth rate',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {card.title}
            </CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">
              {card.description}
            </p>
            {card.trend !== undefined && typeof card.trend === 'number' && (
              <div className={`flex items-center text-xs mt-1 ${
                card.trend >= 0 ? 'text-green-600' : 'text-red-600'
              }`}>
                {card.trend >= 0 ? (
                  <TrendingUp className="h-3 w-3 mr-1" />
                ) : (
                  <TrendingDown className="h-3 w-3 mr-1" />
                )}
                {Math.abs(card.trend).toFixed(1)}% from last period
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}