// File upload form with drag and drop
import { useRef } from 'react'
import { useSelector } from 'react-redux'
import { Upload, FileText, X } from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { Progress } from '../../../components/ui/progress'
import { Card, CardContent } from '../../../components/ui/card'
import { useUploadCSV } from '../hooks/useUploadCSV'
import type { RootState } from '../../../store'
import { cn } from '../../../lib/utils'

export function UploadForm() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { uploadFile, dragActive, handleDrag, handleDrop } = useUploadCSV()
  const { isUploading, uploadProgress, error } = useSelector((state: RootState) => state.upload)

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      uploadFile(file)
    }
  }

  const onButtonClick = () => {
    fileInputRef.current?.click()
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-6">
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-8 text-center transition-colors',
            dragActive ? 'border-primary bg-primary/5' : 'border-gray-300',
            isUploading && 'pointer-events-none opacity-50'
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold mb-2">Upload your CSV file</h3>
          <p className="text-gray-600 mb-4">
            Drag and drop your financial data file here, or click to browse
          </p>
          
          <Button onClick={onButtonClick} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Choose File'}
          </Button>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={onFileSelect}
            className="hidden"
          />
          
          {isUploading && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                Uploading... {Math.round(uploadProgress)}%
              </p>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}