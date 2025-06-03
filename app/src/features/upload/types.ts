// Type definitions for upload feature
export interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  uploadedAt: string
  data: Record<string, any>[]
}

export interface UploadProgress {
  fileId: string
  progress: number
  status: 'uploading' | 'processing' | 'completed' | 'error'
}

export interface UploadError {
  fileId: string
  message: string
  code?: string
}