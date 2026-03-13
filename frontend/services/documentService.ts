import { api } from './api'
import { Document, DocumentUploadResponse } from '@/types'

export const documentService = {
  // Upload a document
  async uploadDocument(file: File, title?: string): Promise<DocumentUploadResponse> {
    const formData = new FormData()
    formData.append('file', file)
    if (title) {
      formData.append('title', title)
    }
    
    const response = await api.post('/documents/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },
  
  // Get all documents
  async getDocuments(): Promise<Document[]> {
    const response = await api.get('/documents/')
    return response.data
  },
  
  // Delete a document
  async deleteDocument(id: number): Promise<void> {
    await api.delete(`/documents/${id}/`)
  },
}