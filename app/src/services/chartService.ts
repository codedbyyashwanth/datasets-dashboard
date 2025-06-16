// Safer chart service with comprehensive error handling and data validation

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
    
    // Comprehensive data validation
    if (!data || !Array.isArray(data) || data.length === 0) {
      throw new Error('No valid data available for chart generation')
    }

    // Check if columns exist
    const sampleRow = data[0]
    if (!sampleRow || typeof sampleRow !== 'object') {
      throw new Error('Invalid data format')
    }

    if (!(xAxis in sampleRow)) {
      throw new Error(`Column '${xAxis}' not found in data`)
    }

    if (!(yAxis in sampleRow)) {
      throw new Error(`Column '${yAxis}' not found in data`)
    }

    // Extract and clean data with proper filtering
    const cleanData = data
      .filter(row => row && typeof row === 'object')
      .filter(row => row[xAxis] !== undefined && row[xAxis] !== null && row[xAxis] !== '')
      .filter(row => row[yAxis] !== undefined && row[yAxis] !== null && row[yAxis] !== '')

    if (cleanData.length === 0) {
      throw new Error(`No valid data found for columns '${xAxis}' and '${yAxis}'`)
    }

    const xValues = cleanData.map(row => row[xAxis])
    const yValues = cleanData.map(row => row[yAxis])

    // Validate numeric data for y-axis when needed
    if (chartType !== 'pie') {
      const numericYValues = yValues.filter(val => typeof val === 'number' && !isNaN(val))
      if (numericYValues.length === 0) {
        throw new Error(`Column '${yAxis}' contains no valid numeric data`)
      }
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
    // Ensure numeric y-values
    const processedYValues = yValues.map(val => {
      const num = Number(val)
      return isNaN(num) ? 0 : num
    })

    return {
      type: 'line',
      data: [{
        x: xValues.slice(),
        y: processedYValues.slice(),
        type: 'scatter',
        mode: 'lines+markers',
        name: this.formatLabel(yAxis),
        line: { 
          color: '#3b82f6',
          width: 3
        },
        marker: {
          color: '#3b82f6',
          size: 6,
          line: {
            color: '#ffffff',
            width: 1
          }
        }
      }],
      layout: this.createLayout(
        `${this.formatLabel(yAxis)} over ${this.formatLabel(xAxis)}`,
        this.formatLabel(xAxis),
        this.formatLabel(yAxis)
      )
    }
  }

  private generateBarChart(xValues: any[], yValues: any[], xAxis: string, yAxis: string): ChartData {
    // Ensure numeric y-values
    const processedYValues = yValues.map(val => {
      const num = Number(val)
      return isNaN(num) ? 0 : num
    })

    return {
      type: 'bar',
      data: [{
        x: xValues.slice(),
        y: processedYValues.slice(),
        type: 'bar',
        marker: { 
          color: '#10b981',
          line: {
            color: '#059669',
            width: 1
          }
        },
        name: this.formatLabel(yAxis)
      }],
      layout: this.createLayout(
        `${this.formatLabel(yAxis)} by ${this.formatLabel(xAxis)}`,
        this.formatLabel(xAxis),
        this.formatLabel(yAxis)
      )
    }
  }

  private generatePieChart(labels: any[], values: any[], labelField: string, valueField: string): ChartData {
    // For pie charts, aggregate data by labels if needed
    const aggregatedData = this.aggregateByLabel(labels, values)
    
    // Filter out zero or negative values
    const filteredData = {
      labels: [] as string[],
      values: [] as number[]
    }
    
    aggregatedData.labels.forEach((label, index) => {
      const value = aggregatedData.values[index]
      if (value > 0) {
        filteredData.labels.push(label)
        filteredData.values.push(value)
      }
    })

    if (filteredData.labels.length === 0) {
      throw new Error('No positive values found for pie chart')
    }

    return {
      type: 'pie',
      data: [{
        labels: filteredData.labels.slice(),
        values: filteredData.values.slice(),
        type: 'pie',
        marker: {
          colors: ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280']
        },
        textinfo: 'label+percent',
        textposition: 'outside',
        hovertemplate: '<b>%{label}</b><br>Value: %{value}<br>Percentage: %{percent}<extra></extra>'
      }],
      layout: {
        title: {
          text: `${this.formatLabel(valueField)} by ${this.formatLabel(labelField)}`,
          font: { size: 16, color: '#374151' }
        },
        font: { color: '#374151', family: 'Inter, system-ui, sans-serif' },
        paper_bgcolor: 'rgba(255,255,255,0)',
        plot_bgcolor: 'rgba(255,255,255,0)',
        showlegend: true,
        legend: {
          orientation: 'v',
          x: 1.05,
          y: 0.5,
          font: { size: 12 }
        },
        margin: { l: 20, r: 120, t: 50, b: 20 }
      }
    }
  }

  private generateScatterChart(xValues: any[], yValues: any[], xAxis: string, yAxis: string): ChartData {
    // Ensure numeric values for both axes
    const processedData = xValues.map((xVal, index) => {
      const x = Number(xVal)
      const y = Number(yValues[index])
      return { x: isNaN(x) ? 0 : x, y: isNaN(y) ? 0 : y }
    }).filter(point => point.x !== 0 || point.y !== 0) // Remove origin points if they're just placeholder zeros

    if (processedData.length === 0) {
      throw new Error('No valid numeric data found for scatter plot')
    }

    return {
      type: 'scatter',
      data: [{
        x: processedData.map(p => p.x),
        y: processedData.map(p => p.y),
        type: 'scatter',
        mode: 'markers',
        marker: { 
          color: '#8b5cf6',
          size: 8,
          opacity: 0.7,
          line: {
            color: '#7c3aed',
            width: 1
          }
        },
        name: `${this.formatLabel(yAxis)} vs ${this.formatLabel(xAxis)}`,
        hovertemplate: `<b>${this.formatLabel(xAxis)}</b>: %{x}<br><b>${this.formatLabel(yAxis)}</b>: %{y}<extra></extra>`
      }],
      layout: this.createLayout(
        `${this.formatLabel(yAxis)} vs ${this.formatLabel(xAxis)}`,
        this.formatLabel(xAxis),
        this.formatLabel(yAxis)
      )
    }
  }

  private createLayout(title: string, xAxisLabel: string, yAxisLabel: string) {
    return {
      title: {
        text: title,
        font: { size: 16, color: '#374151' }
      },
      xaxis: {
        title: { text: xAxisLabel, font: { size: 12 } },
        showgrid: true,
        gridcolor: '#f1f5f9',
        gridwidth: 1,
        color: '#6b7280',
        tickfont: { size: 10 }
      },
      yaxis: {
        title: { text: yAxisLabel, font: { size: 12 } },
        showgrid: true,
        gridcolor: '#f1f5f9',
        gridwidth: 1,
        color: '#6b7280',
        tickfont: { size: 10 }
      },
      font: { color: '#374151', family: 'Inter, system-ui, sans-serif' },
      paper_bgcolor: 'rgba(255,255,255,0)',
      plot_bgcolor: 'rgba(255,255,255,0)',
      margin: { l: 60, r: 30, t: 50, b: 50 },
      showlegend: false,
      hovermode: 'closest'
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

  private formatLabel(text: string): string {
    return text.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }
}

export const chartService = new ChartService()