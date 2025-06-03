// Type definitions for dashboard feature
export interface ChartConfig {
  id: string
  type: 'line' | 'bar' | 'pie' | 'scatter'
  title: string
  xAxis: string
  yAxis: string
  data: any
  layout: any
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