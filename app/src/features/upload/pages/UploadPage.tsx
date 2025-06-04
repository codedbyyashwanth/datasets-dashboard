// Responsive upload page
import { useSelector, useDispatch } from 'react-redux'
import { FileText, Trash2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UploadForm } from '../components/UploadForm'
import type { RootState } from '@/store'
import { removeFile } from '@/store/slices/uploadSlice'
import { formatNumber } from '@/lib/utils'

export default function UploadPage() {
  const dispatch = useDispatch()
  const { files } = useSelector((state: RootState) => state.upload)

  const handleRemoveFile = (fileId: string) => {
    dispatch(removeFile(fileId))
  }

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      <div className="text-center sm:text-left">
        <h1 className="text-2xl font-bold text-gray-900">Upload Data</h1>
        <p className="text-gray-600 mt-1">
          Upload your CSV files to start analyzing your financial data
        </p>
      </div>

      <UploadForm />

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 border rounded-lg gap-3"
                >
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <FileText className="h-8 w-8 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium truncate">{file.name}</p>
                      <p className="text-sm text-gray-600">
                        {formatFileSize(file.size)} • {formatNumber(file.data.length)} rows
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 sm:flex-shrink-0">
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Download</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveFile(file.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="ml-1 hidden sm:inline">Remove</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}