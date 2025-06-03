// Redux slice for file upload management
import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

interface UploadState {
  files: Array<{
    id: string
    name: string
    size: number
    uploadedAt: string
    data: Record<string, any>[]
  }>
  isUploading: boolean
  uploadProgress: number
  error: string | null
}

const initialState: UploadState = {
  files: [],
  isUploading: false,
  uploadProgress: 0,
  error: null,
}

const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    startUpload: (state) => {
      state.isUploading = true
      state.uploadProgress = 0
      state.error = null
    },
    updateProgress: (state, action: PayloadAction<number>) => {
      state.uploadProgress = action.payload
    },
    uploadSuccess: (state, action: PayloadAction<{
      id: string
      name: string
      size: number
      data: Record<string, any>[]
    }>) => {
      state.isUploading = false
      state.uploadProgress = 100
      state.files.push({
        ...action.payload,
        uploadedAt: new Date().toISOString(),
      })
    },
    uploadError: (state, action: PayloadAction<string>) => {
      state.isUploading = false
      state.uploadProgress = 0
      state.error = action.payload
    },
    removeFile: (state, action: PayloadAction<string>) => {
      state.files = state.files.filter(file => file.id !== action.payload)
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const {
  startUpload,
  updateProgress,
  uploadSuccess,
  uploadError,
  removeFile,
  clearError,
} = uploadSlice.actions

export default uploadSlice.reducer