// Custom hook for CSV upload functionality
import { useState, useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { startUpload, uploadSuccess, uploadError, updateProgress } from '../../../store/slices/uploadSlice'
import { parseCSV } from '../../../lib/utils'

export function useUploadCSV() {
  const dispatch = useDispatch()
  const [dragActive, setDragActive] = useState(false)

  const uploadFile = useCallback(async (file: File) => {
    if (!file.name.endsWith('.csv')) {
      dispatch(uploadError('Please upload a CSV file'))
      return
    }

    dispatch(startUpload())

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        dispatch(updateProgress(Math.random() * 90))
      }, 200)

      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const csvText = e.target?.result as string
          const data = parseCSV(csvText)
          
          clearInterval(progressInterval)
          dispatch(updateProgress(100))
          
          dispatch(uploadSuccess({
            id: Date.now().toString(),
            name: file.name,
            size: file.size,
            data,
          }))
        } catch (error) {
          clearInterval(progressInterval)
          dispatch(uploadError('Failed to parse CSV file'))
        }
      }

      reader.onerror = () => {
        clearInterval(progressInterval)
        dispatch(uploadError('Failed to read file'))
      }

      reader.readAsText(file)
    } catch (error) {
      dispatch(uploadError('Upload failed'))
    }
  }, [dispatch])

  const handleDrag = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const files = e.dataTransfer?.files
    if (files && files[0]) {
      uploadFile(files[0])
    }
  }, [uploadFile])

  return {
    uploadFile,
    dragActive,
    handleDrag,
    handleDrop,
  }
}