'use client'

import { useState } from 'react'
import { presentationService } from '@/services/presentationService'
import { QueryRequest, PresentationResponse } from '@/types'
import toast from 'react-hot-toast'

export function usePresentation() {
  const [generating, setGenerating] = useState(false)
  const [presentation, setPresentation] = useState<PresentationResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  
  const generatePresentation = async (query: QueryRequest) => {
    try {
      setGenerating(true)
      setError(null)
      
      toast.loading('Mr. Clarke is analyzing documents...', { id: 'generate' })
      
      const result = await presentationService.generatePresentation(query)
      
      setPresentation(result)
      toast.success('Briefing generated successfully!', { id: 'generate' })
      
      return result
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to generate presentation'
      setError(errorMsg)
      toast.error(errorMsg, { id: 'generate' })
      throw err
    } finally {
      setGenerating(false)
    }
  }
  
  return {
    generating,
    presentation,
    error,
    generatePresentation,
  }
}