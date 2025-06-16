// Enhanced dashboard page with Recharts integration and improved UX
import { useState, useEffect } from 'react'
import { Plus, BarChart3, LineChart, PieChart, ScatterChart, X, AlertCircle, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from '@/components/ui/dialog'
import { DataTable } from '../components/DataTable'
import { ChartDisplay } from '../components/ChartDisplay'
import { MetricsCards } from '../components/MetricsCards'
import { useDashboard } from '../hooks/useDashboard'
import type { ChartConfig } from '../types'

export default function DashboardPage() {
  const { 
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
    clearError
  } = useDashboard()
  
  const [isChartDialogOpen, setIsChartDialogOpen] = useState(false)
  const [selectedChartType, setSelectedChartType] = useState<ChartConfig['type']>('bar')
  const [selectedXAxis, setSelectedXAxis] = useState('')
  const [selectedYAxis, setSelectedYAxis] = useState('')

  // Chart type options with descriptions
  const chartTypes = [
    {
      value: 'bar' as const,
      label: 'Bar Chart',
      icon: BarChart3,
      description: 'Compare categories with vertical bars',
      recommended: true
    },
    {
      value: 'line' as const,
      label: 'Line Chart',
      icon: LineChart,
      description: 'Show trends over time',
      recommended: true
    },
    {
      value: 'pie' as const,
      label: 'Pie Chart',
      icon: PieChart,
      description: 'Show proportions of a whole',
      recommended: false
    },
    {
      value: 'scatter' as const,
      label: 'Scatter Plot',
      icon: ScatterChart,
      description: 'Show correlation between variables',
      recommended: false
    }
  ]

  // Clear form when dialog closes
  useEffect(() => {
    if (!isChartDialogOpen) {
      setSelectedXAxis('')
      setSelectedYAxis('')
    }
  }, [isChartDialogOpen])

  // Auto-suggest best axes based on data
  const getSuggestedAxes = () => {
    if (!availableColumns.all.length) return null
    
    const dateColumns = availableColumns.all.filter(col => 
      col.toLowerCase().includes('date') || col.toLowerCase().includes('time')
    )
    const numericColumns = availableColumns.numeric
    
    if (dateColumns.length > 0 && numericColumns.length > 0) {
      return {
        x: dateColumns[0],
        y: numericColumns[0],
        reason: 'Time series data detected'
      }
    }
    
    if (numericColumns.length >= 2) {
      return {
        x: numericColumns[1],
        y: numericColumns[0],
        reason: 'Numeric comparison suggested'
      }
    }
    
    return null
  }

  const suggestedAxes = getSuggestedAxes()

  const handleCreateChart = async () => {
    if (selectedXAxis && selectedYAxis) {
      const success = await generateChart(selectedChartType, selectedXAxis, selectedYAxis)
      if (success) {
        setIsChartDialogOpen(false)
        setSelectedXAxis('')
        setSelectedYAxis('')
      }
    }
  }

  const handleRemoveChart = (chartId: string) => {
    removeChartById(chartId)
  }

  const applySuggestion = () => {
    if (suggestedAxes) {
      setSelectedXAxis(suggestedAxes.x)
      setSelectedYAxis(suggestedAxes.y)
    }
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center px-4">
        <div className="relative">
          <BarChart3 className="h-16 w-16 text-gray-300 mb-4" />
          <Sparkles className="h-6 w-6 text-blue-500 absolute -top-1 -right-1" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Beautiful Charts</h2>
        <p className="text-gray-600 mb-6 max-w-md">
          Upload your CSV data and transform it into stunning, interactive visualizations with just a few clicks.
        </p>
        <Button onClick={() => window.location.href = '/upload'} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          Upload Your First Dataset
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Create beautiful charts from your data with Recharts
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <Select value={activeFileId || ''} onValueChange={setActiveFileId}>
            <SelectTrigger className="w-full sm:w-64">
              <SelectValue placeholder="Select a dataset" />
            </SelectTrigger>
            <SelectContent>
              {files.map((file) => (
                <SelectItem key={file.id} value={file.id}>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>{file.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          
          <Dialog open={isChartDialogOpen} onOpenChange={setIsChartDialogOpen}>
            <DialogTrigger asChild>
              <Button disabled={!activeFile || isGeneratingChart} size="lg" className="w-full sm:w-auto">
                <Plus className="h-4 w-4 mr-2" />
                {isGeneratingChart ? 'Creating...' : 'Add Chart'}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl mx-4">
              <DialogHeader>
                <DialogTitle className="text-xl">Create New Chart</DialogTitle>
                <DialogDescription>
                  Choose a chart type and configure your axes to visualize your data
                </DialogDescription>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Chart Type Selection */}
                <div>
                  <label className="text-sm font-semibold text-gray-900 mb-3 block">Chart Type</label>
                  <div className="grid grid-cols-2 gap-3">
                    {chartTypes.map((chartType) => (
                      <div
                        key={chartType.value}
                        className={`relative p-4 border-2 rounded-lg cursor-pointer transition-all hover:border-blue-300 ${
                          selectedChartType === chartType.value
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedChartType(chartType.value)}
                      >
                        {chartType.recommended && (
                          <Badge className="absolute -top-2 -right-2 bg-green-500 text-xs">
                            Recommended
                          </Badge>
                        )}
                        <div className="flex items-center space-x-3">
                          <chartType.icon className="h-6 w-6 text-gray-600" />
                          <div>
                            <div className="font-medium text-gray-900">{chartType.label}</div>
                            <div className="text-xs text-gray-500 mt-1">{chartType.description}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Smart Suggestion */}
                {suggestedAxes && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Sparkles className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-900">Smart Suggestion</span>
                      </div>
                      <Button variant="outline" size="sm" onClick={applySuggestion}>
                        Apply
                      </Button>
                    </div>
                    <p className="text-sm text-blue-700 mt-1">
                      {suggestedAxes.reason}: Try {suggestedAxes.x} vs {suggestedAxes.y}
                    </p>
                  </div>
                )}
                
                {/* Axis Selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">X-Axis (Categories)</label>
                    <Select value={selectedXAxis} onValueChange={setSelectedXAxis}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select X-axis" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColumns.all.map((column) => (
                          <SelectItem key={column} value={column}>
                            <div className="flex items-center justify-between w-full">
                              <span>{column.replace(/_/g, ' ').toUpperCase()}</span>
                              {availableColumns.numeric.includes(column) && (
                                <Badge variant="secondary" className="ml-2 text-xs">Numeric</Badge>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-semibold text-gray-900 mb-2 block">Y-Axis (Values)</label>
                    <Select value={selectedYAxis} onValueChange={setSelectedYAxis}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Y-axis" />
                      </SelectTrigger>
                      <SelectContent>
                        {(selectedChartType === 'pie' ? availableColumns.all : availableColumns.numeric).map((column) => (
                          <SelectItem key={column} value={column}>
                            <div className="flex items-center justify-between w-full">
                              <span>{column.replace(/_/g, ' ').toUpperCase()}</span>
                              <Badge variant="secondary" className="ml-2 text-xs">
                                {availableColumns.numeric.includes(column) ? 'Numeric' : 'Text'}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                {/* Create Button */}
                <Button 
                  onClick={handleCreateChart}
                  disabled={!selectedXAxis || !selectedYAxis || isGeneratingChart}
                  className="w-full"
                  size="lg"
                >
                  {isGeneratingChart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creating Chart...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Create Beautiful Chart
                    </>
                  )}
                </Button>
                
                {/* Validation Messages */}
                {availableColumns.numeric.length === 0 && selectedChartType !== 'pie' && (
                  <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded border border-amber-200 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                    No numeric columns found for {selectedChartType} chart. Please ensure your data has numeric columns.
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-red-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">{error}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={clearError}
                className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {activeFile && (
        <>
          {/* Metrics Cards */}
          <MetricsCards metrics={metrics} />
          
          {/* Charts Grid */}
          {charts.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Your Charts</h2>
                <Badge variant="secondary">{charts.length} chart{charts.length !== 1 ? 's' : ''}</Badge>
              </div>
              <div className="grid gap-6 grid-cols-1 xl:grid-cols-2">
                {charts.map((chart) => (
                  <ChartDisplay 
                    key={chart.id} 
                    chart={chart} 
                    onRemove={handleRemoveChart}
                  />
                ))}
              </div>
            </div>
          )}
          
          {/* Empty Charts State */}
          {charts.length === 0 && (
            <Card className="border-dashed border-2 border-gray-300 bg-gray-50/50">
              <CardContent className="p-12 text-center">
                <div className="relative inline-block">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <Sparkles className="h-6 w-6 text-blue-500 absolute -top-1 -right-1" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Create Your First Chart</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Transform your data into beautiful, interactive visualizations. Choose from bar charts, line graphs, pie charts, and scatter plots.
                </p>
                <Button 
                  onClick={() => setIsChartDialogOpen(true)}
                  disabled={!activeFile || isGeneratingChart}
                  size="lg"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Chart
                </Button>
              </CardContent>
            </Card>
          )}
          
          {/* Data Table */}
          <DataTable data={activeFile.data} />
        </>
      )}
    </div>
  )
}