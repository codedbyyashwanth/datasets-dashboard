// Main dashboard page component
import { useState } from 'react'
import { Plus, BarChart3, LineChart, PieChart, ScatterChart } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'
import { DataTable } from '../components/DataTable'
import { ChartDisplay } from '../components/ChartDisplay'
import { MetricsCards } from '../components/MetricsCards'
import { useDashboard } from '../hooks/useDashboard'
import type { ChartConfig } from '../types'

export default function DashboardPage() {
  const { files, activeFile, activeFileId, charts, metrics, generateChart, setActiveFileId } = useDashboard()
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false)
  const [selectedChartType, setSelectedChartType] = useState<ChartConfig['type']>('line')
  const [selectedXAxis, setSelectedXAxis] = useState('')
  const [selectedYAxis, setSelectedYAxis] = useState('')

  const columns = activeFile?.data.length ? Object.keys(activeFile.data[0]) : []
  const numericColumns = columns.filter(col => {
    if (!activeFile?.data.length) return false
    return typeof activeFile.data[0][col] === 'number'
  })

  const handleCreateChart = () => {
    if (selectedXAxis && selectedYAxis) {
      generateChart(selectedChartType, selectedXAxis, selectedYAxis)
      setIsChartDialogOpen(false)
      setSelectedXAxis('')
      setSelectedYAxis('')
    }
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <BarChart3 className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
        <p className="text-gray-600 mb-4">
          Upload a CSV file to start creating your dashboard
        </p>
        <Button onClick={() => window.location.href = '/upload'}>
          Upload Data
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Visualize and analyze your financial data
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={activeFileId || ''} onValueChange={setActiveFileId}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select a dataset" />
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  {file.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isChartDialogOpen} onOpenChange={setIsChartDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!activeFile}>
                <Plus className="h-4 w-4 mr-2" />
                Add Chart
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Chart</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Chart Type</label>
                  <Select value={selectedChartType} onValueChange={(value: ChartConfig['type']) => setSelectedChartType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="line">
                        <div className="flex items-center">
                          <LineChart className="h-4 w-4 mr-2" />
                          Line Chart
                        </div>
                      </SelectItem>
                      <SelectItem value="bar">
                        <div className="flex items-center">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Bar Chart
                        </div>
                      </SelectItem>
                      <SelectItem value="pie">
                        <div className="flex items-center">
                          <PieChart className="h-4 w-4 mr-2" />
                          Pie Chart
                        </div>
                      </SelectItem>
                      <SelectItem value="scatter">
                        <div className="flex items-center">
                          <ScatterChart className="h-4 w-4 mr-2" />
                          Scatter Plot
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">X-Axis</label>
                  <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select X-axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column.replace(/_/g, ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="text-sm font-medium">Y-Axis</label>
                  <Select value={selectedYAxis} onValueChange={setSelectedYAxis}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Y-axis" />
                    </SelectTrigger>
                    <SelectContent>
                      {numericColumns.map((column) => (
                        <SelectItem key={column} value={column}>
                          {column.replace(/_/g, ' ').toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Button 
                  onClick={handleCreateChart}
                  disabled={!selectedXAxis || !selectedYAxis}
                  className="w-full"
                >
                  Create Chart
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {activeFile && (
        <>
          <MetricsCards metrics={metrics} />
          
          {charts.length > 0 && (
            <div className="grid gap-6 md:grid-cols-2">
              {charts.map((chart) => (
                <ChartDisplay key={chart.id} chart={chart} />
              ))}
            </div>
          )}
          
          <DataTable data={activeFile.data} />
        </>
      )}
    </div>
  )
}