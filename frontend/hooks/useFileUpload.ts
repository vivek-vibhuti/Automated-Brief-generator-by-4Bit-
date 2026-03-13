'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import toast from 'react-hot-toast'

interface UseFileUploadProps {
  onUpload: (file: File, title?: string) => Promise<void>
  accept?: Record<string, string[]>
  maxSize?: number
}

export function useFileUpload({ 
  onUpload, 
  accept = {
    'application/pdf': ['.pdf'],
    'text/plain': ['.txt'],
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
  },
  maxSize = 10 * 1024 * 1024 // 10MB
}: UseFileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [title, setTitle] = useState('')
  
  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0]
      setFile(selectedFile)
      setTitle(selectedFile.name.replace(/\.[^/.]+$/, '')) // Default title without extension
    }
  }, [])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
    onDropRejected: (rejections) => {
      const error = rejections[0]?.errors[0]?.message
      toast.error(error || 'File rejected')
    }
  })
  
  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a file first')
      return
    }
    
    try {
      setUploading(true)
      await onUpload(file, title || undefined)
      setFile(null)
      setTitle('')
    } finally {
      setUploading(false)
    }
  }
  
  const reset = () => {
    setFile(null)
    setTitle('')
  }
  
  return {
    file,
    title,
    setTitle,
    uploading,
    isDragActive,
    getRootProps,
    getInputProps,
    handleUpload,
    reset
  }
}