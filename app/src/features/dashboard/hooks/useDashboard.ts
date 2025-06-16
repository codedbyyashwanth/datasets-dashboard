// Enhanced dashboard hook with comprehensive error handling and user feedback
import { useState, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { setActiveFile, addChart, removeChart, setError } from '@/store/slices/dashboardSlice'
import { chartService } from '@/services/chartService'
import type { DashboardMetrics, ChartConfig } from '../types'

export function useDashboard() {
  const dispatch = useDispatch()
  const { files } = useSelector((state: RootState) => state.upload)
  const { activeFileId, charts, error } = useSelector((state: RootState) => state.dashboard)
  const [isGeneratingChart, setIsGeneratingChart] = useState(false)
  
  const activeFile = useMemo(() => 
    files.find(file => file.id === activeFileId), 
    [files, activeFileId]
  )

  const metrics = useMemo((): DashboardMetrics => {
    if (!activeFile?.data || !Array.isArray(activeFile.data)) {
      return { totalRevenue: 0, totalExpenses: 0, profit: 0, growthRate: 0 }
    }

    try {
      const data = activeFile.data
      const totalRevenue = data.reduce((sum, row) => {
        const revenue = Number(row.revenue)
        return sum + (isNaN(revenue) ? 0 : revenue)
      }, 0)
      
      const totalExpenses = data.reduce((sum, row) => {
        const expenses = Number(row.expenses)
        return sum + (isNaN(expenses) ? 0 : expenses)
      }, 0)
      
      const profit = totalRevenue - totalExpenses
      
      // Calculate growth rate (simplified - comparing first and last entries)
      let growthRate = 0
      if (data.length > 1) {
        const firstRevenue = Number(data[0]?.revenue) || 0
        const lastRevenue = Number(data[data.length - 1]?.revenue) || 0
        if (firstRevenue > 0) {
          growthRate = ((lastRevenue - firstRevenue) / firstRevenue) * 100
        }
      }

      return { totalRevenue, totalExpenses, profit, growthRate }
    } catch (error) {
      console.error('Error calculating metrics:', error)
      return { totalRevenue: 0, totalExpenses: 0, profit: 0, growthRate: 0 }
    }
  }, [activeFile])

  const generateChart = async (type: ChartConfig['type'], xAxis: string, yAxis: string) => {
    if (!activeFile?.data) {
      dispatch(setError('No active file data available'))
      return false
    }

    if (!xAxis || !yAxis) {
      dispatch(setError('Please select both X and Y axes'))
      return false
    }

    setIsGeneratingChart(true)
    dispatch(setError(null))

    try {
      const chartData = chartService.generateChart(activeFile.data, {
        fileId: activeFile.id,
        chartType: type,
        xAxis,
        yAxis,
      })

      const newChart: ChartConfig = {
        id: `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        type,
        title: `${yAxis.replace(/_/g, ' ').toUpperCase()} by ${xAxis.replace(/_/g, ' ').toUpperCase()}`,
        xAxis,
        yAxis,
        data: chartData.data,
        layout: chartData.layout,
      }

      dispatch(addChart(newChart))
      return true
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to generate chart'
      console.error('Error generating chart:', error)
      dispatch(setError(errorMessage))
      return false
    } finally {
      setIsGeneratingChart(false)
    }
  }

  const removeChartById = (chartId: string) => {
    try {
      const chartIndex = charts.findIndex(chart => chart.id === chartId)
      if (chartIndex !== -1) {
        dispatch(removeChart(chartIndex))
      } else {
        console.warn(`Chart with ID ${chartId} not found`)
      }
    } catch (error) {
      console.error('Error removing chart:', error)
      dispatch(setError('Failed to remove chart'))
    }
  }

  const setActiveFileId = (fileId: string) => {
    try {
      dispatch(setActiveFile(fileId))
      dispatch(setError(null)) // Clear any previous errors
    } catch (error) {
      console.error('Error setting active file:', error)
      dispatch(setError('Failed to select file'))
    }
  }

  const clearError = () => {
    dispatch(setError(null))
  }

  // Get available columns for chart creation
  const availableColumns = useMemo(() => {
    if (!activeFile?.data || !Array.isArray(activeFile.data) || activeFile.data.length === 0) {
      return { all: [], numeric: [] }
    }

    try {
      const sampleRow = activeFile.data[0]
      if (!sampleRow || typeof sampleRow !== 'object') {
        return { all: [], numeric: [] }
      }

      const allColumns = Object.keys(sampleRow)
      const numericColumns = allColumns.filter(col => {
        // Check if column contains mostly numeric data
        const sampleValues = activeFile.data.slice(0, 10).map(row => row[col])
        const numericCount = sampleValues.filter(val => {
          const num = Number(val)
          return !isNaN(num) && isFinite(num)
        }).length
        return numericCount > sampleValues.length * 0.5 // At least 50% numeric
      })

      return { all: allColumns, numeric: numericColumns }
    } catch (error) {
      console.error('Error analyzing columns:', error)
      return { all: [], numeric: [] }
    }
  }, [activeFile])

  return {
    files,
    activeFile,
    activeFileId,
    charts,
    metrics,
    error,
    isGeneratingChart,
    availableColumns,
    generateChart,
    removeChartById,
    setActiveFileId,
    clearError,
  }
}

export type UseDashboardReturn = ReturnType<typeof useDashboard>