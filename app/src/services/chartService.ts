// Fixed chart service with proper data structure
import { formatCurrency, formatNumber } from '../lib/utils'

export interface ChartRequest {
  fileId: string
  chartType: 'line' | 'bar' | 'pie' | 'scatter'
  xAxis: string
  yAxis: string
  filters?: Record<string, any>
}

export interface ChartData {
  type: string
  data: any[]
  layout: any
}

class ChartService {
  generateChart(data: Record<string, any>[], config: ChartRequest): ChartData {
    const { chartType, xAxis, yAxis } = config
    
    // Validate data
    if (!data || data.length === 0) {
      throw new Error('No data available for chart generation')
    }

    // Extract and clean data
    const xValues = data.map(row => row[xAxis]).filter(val => val !== undefined && val !== null)
    const yValues = data.map(row => row[yAxis]).filter(val => val !== undefined && val !== null)

    if (xValues.length === 0 || yValues.length === 0) {
      throw new Error(`Invalid data for axes: ${xAxis}, ${yAxis}`)
    }
    
    switch (chartType) {
      case 'line':
        return this.generateLineChart(xValues, yValues, xAxis, yAxis)
      case 'bar':
        return this.generateBarChart(xValues, yValues, xAxis, yAxis)
      case 'pie':
        return this.generatePieChart(xValues, yValues, xAxis, yAxis)
      case 'scatter':
        return this.generateScatterChart(xValues, yValues, xAxis, yAxis)
      default:
        throw new Error(`Unsupported chart type: ${chartType}`)
    }
  }

  private generateLineChart(xValues: any[], yValues: any[], xAxis: string, yAxis: string): ChartData {
    return {
      type: 'line',
      data: [{
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines+markers',
        name: yAxis.replace(/_/g, ' ').toUpperCase(),
        line: { 
          color: '#3b82f6',
          width: 3
        },
        marker: {
          color: '#3b82f6',
          size: 6
        }
      }],
      layout: {
        title: {
          text: `${yAxis.replace(/_/g, ' ').toUpperCase()} over ${xAxis.replace(/_/g, ' ').toUpperCase()}`,
          font: { size: 16 }
        },
        xaxis: { 
          title: xAxis.replace(/_/g, ' ').toUpperCase(),
          showgrid: true,
          gridcolor: '#f1f5f9'
        },
        yaxis: { 
          title: yAxis.replace(/_/g, ' ').toUpperCase(),
          showgrid: true,
          gridcolor: '#f1f5f9'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#374151' }
      }
    }
  }

  private generateBarChart(xValues: any[], yValues: any[], xAxis: string, yAxis: string): ChartData {
    return {
      type: 'bar',
      data: [{
        x: xValues,
        y: yValues,
        type: 'bar',
        marker: { 
          color: '#10b981',
          line: {
            color: '#059669',
            width: 1
          }
        },
        name: yAxis.replace(/_/g, ' ').toUpperCase()
      }],
      layout: {
        title: {
          text: `${yAxis.replace(/_/g, ' ').toUpperCase()} by ${xAxis.replace(/_/g, ' ').toUpperCase()}`,
          font: { size: 16 }
        },
        xaxis: { 
          title: xAxis.replace(/_/g, ' ').toUpperCase(),
          showgrid: false
        },
        yaxis: { 
          title: yAxis.replace(/_/g, ' ').toUpperCase(),
          showgrid: true,
          gridcolor: '#f1f5f9'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#374151' }
      }
    }
  }

  private generatePieChart(labels: any[], values: any[], labelField: string, valueField: string): ChartData {
    // For pie charts, aggregate data by labels if needed
    const aggregatedData = this.aggregateByLabel(labels, values)
    
    return {
      type: 'pie',
      data: [{
        labels: aggregatedData.labels,
        values: aggregatedData.values,
        type: 'pie',
        marker: {
          colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899']
        },
        textinfo: 'label+percent',
        textposition: 'outside'
      }],
      layout: {
        title: {
          text: `${valueField.replace(/_/g, ' ').toUpperCase()} by ${labelField.replace(/_/g, ' ').toUpperCase()}`,
          font: { size: 16 }
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#374151' },
        showlegend: true,
        legend: {
          orientation: 'v',
          x: 1,
          y: 0.5
        }
      }
    }
  }

  private generateScatterChart(xValues: any[], yValues: any[], xAxis: string, yAxis: string): ChartData {
    return {
      type: 'scatter',
      data: [{
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'markers',
        marker: { 
          color: '#8b5cf6',
          size: 8,
          opacity: 0.7
        },
        name: `${yAxis} vs ${xAxis}`
      }],
      layout: {
        title: {
          text: `${yAxis.replace(/_/g, ' ').toUpperCase()} vs ${xAxis.replace(/_/g, ' ').toUpperCase()}`,
          font: { size: 16 }
        },
        xaxis: { 
          title: xAxis.replace(/_/g, ' ').toUpperCase(),
          showgrid: true,
          gridcolor: '#f1f5f9'
        },
        yaxis: { 
          title: yAxis.replace(/_/g, ' ').toUpperCase(),
          showgrid: true,
          gridcolor: '#f1f5f9'
        },
        plot_bgcolor: 'rgba(0,0,0,0)',
        paper_bgcolor: 'rgba(0,0,0,0)',
        font: { color: '#374151' }
      }
    }
  }

  private aggregateByLabel(labels: any[], values: any[]): { labels: string[], values: number[] } {
    const aggregation: { [key: string]: number } = {}
    
    labels.forEach((label, index) => {
      const key = String(label)
      const value = Number(values[index]) || 0
      aggregation[key] = (aggregation[key] || 0) + value
    })
    
    return {
      labels: Object.keys(aggregation),
      values: Object.values(aggregation)
    }
  }
}

export const chartService = new ChartService()