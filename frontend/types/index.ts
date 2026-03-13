// Document Types
export interface Document {
  id: number
  title: string
  file: string
  uploaded_at: string
  processed: boolean
}

export interface DocumentUploadResponse {
  message: string
  document_id: number
  chunks_count: number
}

// Query Types
export interface QueryRequest {
  query: string
  document_ids?: number[]
  slide_count?: number
  llm_provider?: 'gemini' | 'groq' | 'anthropic'
}

// Presentation Types
export interface Reference {
  source: string
  page?: string | number
  snippet: string
  relevance?: number
}

export interface Slide {
  type: 'title' | 'content'
  title: string
  content: string[]
}

export interface PresentationOutline {
  title: string
  slides: Slide[]
  references: Reference[]
}

export interface PresentationResponse {
  presentation_id: number
  slides_html: string
  slide_count: number
  references: Reference[]
}

export interface Presentation {
  id: number
  query: string
  created_at: string
  slides_html: string
  slide_count: number
}