// Display component for insights and recommendations
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

interface Insight {
  id: string
  title: string
  description: string
  type: 'trend' | 'anomaly' | 'recommendation'
  confidence: number
  impact: 'high' | 'medium' | 'low'
}

export function InsightsDisplay() {
  // Mock insights - in real app this would come from AI analysis
  const insights: Insight[] = [
    {
      id: '1',
      title: 'Revenue Growth Accelerating',
      description: 'Revenue growth has increased by 15% in the last quarter, driven primarily by the Software Licenses product line.',
      type: 'trend',
      confidence: 92,
      impact: 'high',
    },
    {
      id: '2',
      title: 'Expense Optimization Opportunity',
      description: 'Marketing expenses in the Europe region are 23% higher than the industry average but showing lower ROI.',
      type: 'recommendation',
      confidence: 87,
      impact: 'medium',
    },
    {
      id: '3',
      title: 'Seasonal Pattern Detected',
      description: 'Customer acquisition shows a strong seasonal pattern with 40% higher conversion rates in Q4.',
      type: 'trend',
      confidence: 95,
      impact: 'medium',
    },
    {
      id: '4',
      title: 'Profit Margin Decline',
      description: 'Profit margins have decreased by 3.2% over the last 6 months. Consider reviewing pricing strategy.',
      type: 'anomaly',
      confidence: 89,
      impact: 'high',
    },
  ]

  const getInsightIcon = (type: Insight['type']) => {
    switch (type) {
      case 'trend':
        return TrendingUp
      case 'anomaly':
        return AlertCircle
      case 'recommendation':
        return Lightbulb
      default:
        return TrendingUp
    }
  }

  const getInsightColor = (type: Insight['type']) => {
    switch (type) {
      case 'trend':
        return 'text-blue-600 bg-blue-50'
      case 'anomaly':
        return 'text-red-600 bg-red-50'
      case 'recommendation':
        return 'text-green-600 bg-green-50'
      default:
        return 'text-gray-600 bg-gray-50'
    }
  }

  const getImpactColor = (impact: Insight['impact']) => {
    switch (impact) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">AI-Generated Insights</h3>
        <Badge variant="secondary">{insights.length} insights found</Badge>
      </div>
      
      {insights.map((insight) => {
        const Icon = getInsightIcon(insight.type)
        
        return (
          <Card key={insight.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-full ${getInsightColor(insight.type)}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{insight.title}</CardTitle>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className={getImpactColor(insight.impact)}>
                        {insight.impact.toUpperCase()} IMPACT
                      </Badge>
                      <Badge variant="outline">
                        {insight.type.toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-3">{insight.description}</p>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500">Confidence:</span>
                <Progress value={insight.confidence} className="flex-1 max-w-32" />
                <span className="text-sm font-medium">{insight.confidence}%</span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}