import { AppRoutes } from './routes/AppRoutes'
import { Layout } from './components/layout/Layout'
import { Toaster } from './components/ui/sonner'

function App() {
  return (
    <div className="min-h-screen bg-background">
      <Layout>
        <AppRoutes />
      </Layout>
      <Toaster />
    </div>
  )
}

export default App