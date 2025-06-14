// Enhanced Redux slice for dashboard with error handling
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ChartConfig {
  id: string
  type: 'line' | 'bar' | 'pie' | 'scatter'
  title: string
  xAxis: string
  yAxis: string
  data: any[]
  layout: any
}

interface DashboardState {
  activeFileId: string | null
  charts: ChartConfig[]
  filters: Record<string, any>
  isLoading: boolean
  error: string | null
}

const initialState: DashboardState = {
  activeFileId: null,
  charts: [],
  filters: {},
  isLoading: false,
  error: null,
}

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    setActiveFile: (state, action: PayloadAction<string>) => {
      state.activeFileId = action.payload
      state.error = null // Clear error when switching files
    },
    addChart: (state, action: PayloadAction<ChartConfig>) => {
      state.charts.push(action.payload)
      state.error = null // Clear error on successful chart creation
    },
    removeChart: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.charts.length) {
        state.charts.splice(action.payload, 1)
        state.error = null
      }
    },
    updateChart: (state, action: PayloadAction<{ index: number; chart: ChartConfig }>) => {
      const { index, chart } = action.payload
      if (index >= 0 && index < state.charts.length) {
        state.charts[index] = chart
        state.error = null
      }
    },
    updateFilters: (state, action: PayloadAction<Record<string, any>>) => {
      state.filters = { ...state.filters, ...action.payload }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
    clearCharts: (state) => {
      state.charts = []
      state.error = null
    },
    resetDashboard: (state) => {
      state.activeFileId = null
      state.charts = []
      state.filters = {}
      state.isLoading = false
      state.error = null
    }
  },
})

export const {
  setActiveFile,
  addChart,
  removeChart,
  updateChart,
  updateFilters,
  setLoading,
  setError,
  clearCharts,
  resetDashboard,
} = dashboardSlice.actions

export default dashboardSlice.reducer