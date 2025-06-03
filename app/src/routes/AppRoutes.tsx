// React Router configuration with lazy loading
import { Routes, Route, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { Loader2 } from 'lucide-react'

// Lazy load pages for code splitting
const UploadPage = lazy(() => import('../features/upload/pages/UploadPage'))
const DashboardPage = lazy(() => import('../features/dashboard/pages/DashboardPage'))
const InsightsPage = lazy(() => import('../features/insights/pages/InsightsPage'))

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
}

export function AppRoutes() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/" element={<Navigate to="/upload" replace />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/insights" element={<InsightsPage />} />
      </Routes>
    </Suspense>
  )
}