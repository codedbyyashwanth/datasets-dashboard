// Updated type definitions for dashboard with Recharts support
export interface ChartConfig {
  id: string
  type: 'line' | 'bar' | 'pie' | 'scatter'
  title: string
  xAxis: string
  yAxis: string
  data: any[]
  layout: {
    title: string
    xAxisLabel?: string
    yAxisLabel?: string
  }
}

export interface FilterConfig {
  column: string
  operator: 'equals' | 'contains' | 'greater' | 'less' | 'between'
  value: any
}

export interface DashboardMetrics {
  totalRevenue: number
  totalExpenses: number
  profit: number
  growthRate: number
}

// Recharts data format
export interface RechartsDataPoint {
  name: string
  value: number
  x?: any
  y?: any
}

// Chart data transformation interface
export interface ChartDataTransformer {
  transformForRecharts: (chartData: any[]) => RechartsDataPoint[]
}