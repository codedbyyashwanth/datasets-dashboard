// Responsive chat interface
import { useState, useRef, useEffect } from 'react'
import { Send, Bot, User } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Input } from '../../../components/ui/input'
import { Card, CardContent } from '../../../components/ui/card'
import { Badge } from '../../../components/ui/badge'
import { useAskAI } from '../hooks/useAskAI'
import { cn } from '../../../lib/utils'

export function ChatInterface() {
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { messages, isLoading, askQuestion } = useAskAI()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (inputValue.trim() && !isLoading) {
      askQuestion(inputValue.trim())
      setInputValue('')
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    if (!isLoading) {
      askQuestion(suggestion)
    }
  }

  const suggestions = [
    "What are the top revenue drivers?",
    "Show me expense trends over time",
    "Compare performance by region",
    "What's the profit margin by product?",
  ]

  return (
    <div className="flex flex-col h-96 sm:h-[500px]">
      <div className="flex-1 overflow-y-auto p-2 sm:p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 mt-4 sm:mt-8">
            <Bot className="h-10 w-10 sm:h-12 sm:w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-base sm:text-lg font-medium mb-2">Ask me anything about your data</p>
            <p className="text-sm mb-4">Try one of these suggestions:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground text-xs sm:text-sm"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion}
                </Badge>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex items-start space-x-2 sm:space-x-3',
                  message.type === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.type === 'ai' && (
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                  </div>
                )}
                
                <Card className={cn(
                  'max-w-[85%] sm:max-w-lg',
                  message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-gray-50'
                )}>
                  <CardContent className="p-2 sm:p-3">
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    {message.metadata?.confidence && (
                      <div className="mt-2 text-xs opacity-70">
                        Confidence: {Math.round(message.metadata.confidence * 100)}%
                      </div>
                    )}
                    {message.metadata?.chartSuggestions && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.metadata.chartSuggestions.map((suggestion, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {suggestion}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
                
                {message.type === 'user' && (
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex items-start space-x-2 sm:space-x-3">
                <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-primary rounded-full flex items-center justify-center">
                  <Bot className="h-3 w-3 sm:h-4 sm:w-4 text-primary-foreground" />
                </div>
                <Card className="bg-gray-50">
                  <CardContent className="p-2 sm:p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="border-t p-2 sm:p-4">
        <form onSubmit={handleSubmit} className="flex space-x-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask a question about your data..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={!inputValue.trim() || isLoading} size="sm" className="px-3">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}