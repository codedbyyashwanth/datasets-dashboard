// Service for generating chart configurations
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
  data: any
  layout: any
}

class ChartService {
  generateChart(data: Record<string, any>[], config: ChartRequest): ChartData {
    const { chartType, xAxis, yAxis } = config
    
    switch (chartType) {
      case 'line':
        return this.generateLineChart(data, xAxis, yAxis)
      case 'bar':
        return this.generateBarChart(data, xAxis, yAxis)
      case 'pie':
        return this.generatePieChart(data, xAxis, yAxis)
      case 'scatter':
        return this.generateScatterChart(data, xAxis, yAxis)
      default:
        throw new Error(`Unsupported chart type: ${chartType}`)
    }
  }

  private generateLineChart(data: Record<string, any>[], xAxis: string, yAxis: string): ChartData {
    const xValues = data.map(row => row[xAxis])
    const yValues = data.map(row => row[yAxis])

    return {
      type: 'line',
      data: [{
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'lines+markers',
        name: yAxis,
        line: { color: '#3b82f6' },
      }],
      layout: {
        title: `${yAxis} over ${xAxis}`,
        xaxis: { title: xAxis },
        yaxis: { title: yAxis },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
      },
    }
  }

  private generateBarChart(data: Record<string, any>[], xAxis: string, yAxis: string): ChartData {
    const xValues = data.map(row => row[xAxis])
    const yValues = data.map(row => row[yAxis])

    return {
      type: 'bar',
      data: [{
        x: xValues,
        y: yValues,
        type: 'bar',
        marker: { color: '#10b981' },
      }],
      layout: {
        title: `${yAxis} by ${xAxis}`,
        xaxis: { title: xAxis },
        yaxis: { title: yAxis },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
      },
    }
  }

  private generatePieChart(data: Record<string, any>[], labels: string, values: string): ChartData {
    const labelValues = data.map(row => row[labels])
    const valueValues = data.map(row => row[values])

    return {
      type: 'pie',
      data: [{
        labels: labelValues,
        values: valueValues,
        type: 'pie',
      }],
      layout: {
        title: `${values} by ${labels}`,
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
      },
    }
  }

  private generateScatterChart(data: Record<string, any>[], xAxis: string, yAxis: string): ChartData {
    const xValues = data.map(row => row[xAxis])
    const yValues = data.map(row => row[yAxis])

    return {
      type: 'scatter',
      data: [{
        x: xValues,
        y: yValues,
        type: 'scatter',
        mode: 'markers',
        marker: { color: '#8b5cf6' },
      }],
      layout: {
        title: `${yAxis} vs ${xAxis}`,
        xaxis: { title: xAxis },
        yaxis: { title: yAxis },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
      },
    }
  }
}

export const chartService = new ChartService()