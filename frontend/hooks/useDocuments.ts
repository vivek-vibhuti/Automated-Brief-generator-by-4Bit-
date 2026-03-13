'use client'

import { useState, useEffect } from 'react'
import { documentService } from '@/services/documentService'
import { Document } from '@/types'
import toast from 'react-hot-toast'

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchDocuments = async () => {
    try {
      setLoading(true)
      const data = await documentService.getDocuments()
      setDocuments(data)
      setError(null)
    } catch (err: any) {
      setError(err.message || 'Failed to fetch documents')
      toast.error('Failed to fetch documents from Hawkins Lab')
    } finally {
      setLoading(false)
    }
  }
  
  const uploadDocument = async (file: File, title?: string) => {
    try {
      setLoading(true)
      const response = await documentService.uploadDocument(file, title)
      toast.success(`Document processed: ${response.chunks_count} chunks created`)
      await fetchDocuments() // Refresh list
      return response
    } catch (err: any) {
      toast.error(err.message || 'Failed to upload document')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  const deleteDocument = async (id: number) => {
    try {
      setLoading(true)
      await documentService.deleteDocument(id)
      toast.success('Document deleted from Hawkins database')
      await fetchDocuments() // Refresh list
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete document')
      throw err
    } finally {
      setLoading(false)
    }
  }
  
  useEffect(() => {
    fetchDocuments()
  }, [])
  
  return {
    documents,
    loading,
    error,
    uploadDocument,
    deleteDocument,
    refresh: fetchDocuments,
  }
}