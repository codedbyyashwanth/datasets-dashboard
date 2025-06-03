// Redux slice for dashboard data and charts
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface ChartConfig {
  type: 'line' | 'bar' | 'pie' | 'scatter'
  data: any
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
    },
    addChart: (state, action: PayloadAction<ChartConfig>) => {
      state.charts.push(action.payload)
    },
    removeChart: (state, action: PayloadAction<number>) => {
      state.charts.splice(action.payload, 1)
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
  },
})

export const {
  setActiveFile,
  addChart,
  removeChart,
  updateFilters,
  setLoading,
  setError,
} = dashboardSlice.actions

export default dashboardSlice.reducer