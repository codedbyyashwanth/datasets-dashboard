// Main insights page component
import { useSelector } from 'react-redux'
import { MessageSquare, Brain, TrendingUp } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../../components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs'
import { ChatInterface } from '../components/ChatInterface'
import { InsightsDisplay } from '../components/InsightsDisplay'
import type { RootState } from '../../../store'

export default function InsightsPage() {
  const { files } = useSelector((state: RootState) => state.upload)
  const { activeFileId } = useSelector((state: RootState) => state.dashboard)

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <Brain className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">No Data Available</h2>
        <p className="text-gray-600 mb-4">
          Upload a CSV file to start getting AI-powered insights
        </p>
        <Button onClick={() => window.location.href = '/upload'}>
          Upload Data
        </Button>
      </div>
    )
  }

  if (!activeFileId) {
    return (
      <div className="flex flex-col items-center justify-center min-h-96 text-center">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Select a Dataset</h2>
        <p className="text-gray-600 mb-4">
          Choose a dataset from the dashboard to start asking questions
        </p>
        <Button onClick={() => window.location.href = '/dashboard'}>
          Go to Dashboard
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">AI Insights</h1>
        <p className="text-gray-600 mt-1">
          Get intelligent insights and ask questions about your financial data
        </p>
      </div>

      <Tabs defaultValue="chat" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chat" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Chat with AI</span>
          </TabsTrigger>
          <TabsTrigger value="insights" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Auto Insights</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Brain className="h-5 w-5" />
                <span>Ask AI Assistant</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ChatInterface />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights">
          <InsightsDisplay />
        </TabsContent>
      </Tabs>
    </div>
  )
}