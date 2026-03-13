import { api } from './api'
import { QueryRequest, PresentationResponse, Presentation } from '@/types'

export const presentationService = {
  // Generate presentation from query
  async generatePresentation(data: QueryRequest): Promise<PresentationResponse> {
    const response = await api.post('/presentations/generate/', data)
    return response.data
  },
  
  // Get a specific presentation
  async getPresentation(id: number): Promise<Presentation> {
    const response = await api.get(`/presentations/${id}/`)
    return response.data
  },
}