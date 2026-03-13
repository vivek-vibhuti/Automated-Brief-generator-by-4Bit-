'use client'

import { useState } from 'react'
import { useDocuments } from '@/hooks/useDocuments'
import { QueryRequest } from '@/types'
import { motion } from 'framer-motion'

interface QueryFormProps {
  onSubmit: (data: QueryRequest) => Promise<void>
  generating: boolean
}

const QueryForm = ({ onSubmit, generating }: QueryFormProps) => {
  const { documents } = useDocuments()
  const [query, setQuery] = useState('')
  const [selectedDocs, setSelectedDocs] = useState<number[]>([])
  const [slideCount, setSlideCount] = useState(5)
  const [llmProvider, setLlmProvider] = useState<'gemini' | 'groq' | 'anthropic'>('gemini')
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    
    await onSubmit({
      query: query.trim(),
      document_ids: selectedDocs.length > 0 ? selectedDocs : undefined,
      slide_count: slideCount,
      llm_provider: llmProvider
    })
  }
  
  const toggleDocument = (docId: number) => {
    setSelectedDocs(prev =>
      prev.includes(docId)
        ? prev.filter(id => id !== docId)
        : [...prev, docId]
    )
  }
  
  return (
    <form onSubmit={handleSubmit} className="retro-card p-6 space-y-6">
      <h2 className="text-xl font-bold text-green-500 mb-4 glitch-text">
        {`>_ ENTER BRIEFING QUERY`}
      </h2>
      
      {/* Query Input */}
      <div>
        <label className="block text-green-500 mb-2 text-sm">
          What would you like to know?
        </label>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="E.g., Explain the physics of the Upside Down gateways..."
          rows={4}
          className="w-full bg-black border border-green-500 border-opacity-30 
                   p-3 text-green-500 placeholder-green-500 placeholder-opacity-30
                   focus:border-opacity-100 focus:outline-none"
        />
      </div>
      
      {/* Document Selection */}
      <div>
        <label className="block text-green-500 mb-2 text-sm">
          Filter by documents (optional)
        </label>
        <div className="border border-green-500 border-opacity-30 p-3 max-h-40 overflow-y-auto retro-scroll">
          {documents.length === 0 ? (
            <p className="text-green-500 text-opacity-50 text-sm">
              No documents uploaded yet
            </p>
          ) : (
            documents.map((doc) => (
              <label
                key={doc.id}
                className="flex items-center space-x-3 py-2 cursor-pointer
                         hover:bg-green-500 hover:bg-opacity-10 px-2"
              >
                <input
                  type="checkbox"
                  checked={selectedDocs.includes(doc.id)}
                  onChange={() => toggleDocument(doc.id)}
                  className="form-checkbox bg-black border-green-500 text-green-500
                           rounded-none focus:ring-0 focus:ring-offset-0"
                />
                <span className="text-green-500 text-sm">{doc.title}</span>
                {!doc.processed && (
                  <span className="text-yellow-500 text-xs">(processing)</span>
                )}
              </label>
            ))
          )}
        </div>
      </div>
      
      {/* Settings */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-green-500 mb-2 text-sm">
            Number of slides
          </label>
          <select
            value={slideCount}
            onChange={(e) => setSlideCount(Number(e.target.value))}
            className="w-full bg-black border border-green-500 border-opacity-30 
                     p-2 text-green-500 focus:border-opacity-100 focus:outline-none"
          >
            {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
              <option key={num} value={num}>{num} slides</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-green-500 mb-2 text-sm">
            AI Provider
          </label>
          <select
            value={llmProvider}
            onChange={(e) => setLlmProvider(e.target.value as any)}
            className="w-full bg-black border border-green-500 border-opacity-30 
                     p-2 text-green-500 focus:border-opacity-100 focus:outline-none"
          >
            <option value="gemini">Google Gemini (Free)</option>
            <option value="groq">Groq (Fast)</option>
            <option value="anthropic">Claude (Haiku)</option>
          </select>
        </div>
      </div>
      
      {/* Submit Button */}
      <button
        type="submit"
        disabled={generating || !query.trim()}
        className="hawkins-button w-full flex items-center justify-center space-x-2
                 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {generating ? (
          <>
            <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
            <span>GENERATING BRIEFING...</span>
          </>
        ) : (
          <>
            <span>GENERATE PRESENTATION</span>
          </>
        )}
      </button>
      
      {/* System Status */}
      <div className="text-xs text-green-500 text-opacity-50 border-t border-green-500 border-opacity-20 pt-4">
        {`>_ SYSTEM READY | DOCUMENTS LOADED: ${documents.length}`}
      </div>
    </form>
  )
}

export default QueryForm