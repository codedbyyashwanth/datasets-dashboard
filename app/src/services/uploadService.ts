// Service for handling CSV file uploads
import apiClient from './apiClient'

export interface UploadResponse {
  id: string
  filename: string
  rowCount: number
  columns: string[]
}

class UploadService {
  async uploadCSV(file: File): Promise<UploadResponse> {
    // Simulate upload for demo - in real app this would call the backend
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string
          const lines = csvText.trim().split('\n')
          const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))
          
          setTimeout(() => {
            resolve({
              id: Date.now().toString(),
              filename: file.name,
              rowCount: lines.length - 1,
              columns: headers,
            })
          }, 1000) // Simulate network delay
        } catch (error) {
          reject(new Error('Failed to parse CSV file'))
        }
      }
      
      reader.onerror = () => reject(new Error('Failed to read file'))
      reader.readAsText(file)
    })
  }

  async getUploadStatus(uploadId: string): Promise<{ status: string; progress: number }> {
    // Mock status check
    return { status: 'completed', progress: 100 }
  }
}

export const uploadService = new UploadService()