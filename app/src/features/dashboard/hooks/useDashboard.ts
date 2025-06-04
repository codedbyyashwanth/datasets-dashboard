// Custom hook for dashboard functionality
import { useState, useEffect, useMemo } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import type { RootState } from '@/store'
import { setActiveFile, addChart } from '@/store/slices/dashboardSlice'
import { chartService } from '@/services/chartService'
import type { DashboardMetrics, ChartConfig } from '../types'

export function useDashboard() {
  const dispatch = useDispatch()
  const { files } = useSelector((state: RootState) => state.upload)
  const { activeFileId, charts } = useSelector((state: RootState) => state.dashboard)
  
  const activeFile = useMemo(() => 
    files.find(file => file.id === activeFileId), 
    [files, activeFileId]
  )

  const metrics = useMemo((): DashboardMetrics => {
    if (!activeFile?.data) {
      return { totalRevenue: 0, totalExpenses: 0, profit: 0, growthRate: 0 }
    }

    const data = activeFile.data
    const totalRevenue = data.reduce((sum, row) => sum + (row.revenue || 0), 0)
    const totalExpenses = data.reduce((sum, row) => sum + (row.expenses || 0), 0)
    const profit = totalRevenue - totalExpenses
    
    // Calculate growth rate (simplified)
    const growthRate = data.length > 1 ? 
      ((data[data.length - 1]?.revenue || 0) - (data[0]?.revenue || 0)) / (data[0]?.revenue || 1) * 100 : 0

    return { totalRevenue, totalExpenses, profit, growthRate }
  }, [activeFile])

  const generateChart = (type: ChartConfig['type'], xAxis: string, yAxis: string) => {
    if (!activeFile?.data) return

    try {
      const chartData = chartService.generateChart(activeFile.data, {
        fileId: activeFile.id,
        chartType: type,
        xAxis,
        yAxis,
      })

      const newChart: ChartConfig = {
        id: Date.now().toString(),
        type,
        title: `${yAxis} by ${xAxis}`,
        xAxis,
        yAxis,
        data: chartData.data,
        layout: chartData.layout,
      }

      dispatch(addChart(newChart))
    } catch (error) {
      console.error('Error generating chart:', error)
    }
  }

  const setActiveFileId = (fileId: string) => {
    dispatch(setActiveFile(fileId))
  }

  return {
    files,
    activeFile,
    activeFileId,
    charts,
    metrics,
    generateChart,
    setActiveFileId,
  }
}