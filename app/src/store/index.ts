// Redux store configuration with RTK
import { configureStore } from '@reduxjs/toolkit'
import uploadSlice from './slices/uploadSlice'
import dashboardSlice from './slices/dashboardSlice'
import insightSlice from './slices/insightSlice'

export const store = configureStore({
  reducer: {
    upload: uploadSlice,
    dashboard: dashboardSlice,
    insights: insightSlice,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch