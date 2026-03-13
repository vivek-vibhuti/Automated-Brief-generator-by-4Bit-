'use client'

import { Document } from '@/types'
import DocumentCard from './DocumentCard'
import { motion, AnimatePresence } from 'framer-motion'

interface DocumentListProps {
  documents: Document[]
  onDelete: (id: number) => void
  loading?: boolean
}

const DocumentList = ({ documents, onDelete, loading }: DocumentListProps) => {
  if (loading) {
    return (
      <div className="retro-card p-8 text-center">
        <div className="inline-block w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-green-500">ACCESSING HAWKINS DATABASE...</p>
      </div>
    )
  }

  if (documents.length === 0) {
    return (
      <div className="retro-card p-8 text-center border border-green-500 border-opacity-30">
        <p className="text-green-500 text-opacity-70 mb-2">NO DOCUMENTS FOUND</p>
        <p className="text-green-500 text-sm">
          {`>_ Upload Mr. Clarke's documents to begin`}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {documents.map((doc) => (
          <DocumentCard key={doc.id} document={doc} onDelete={onDelete} />
        ))}
      </AnimatePresence>
    </div>
  )
}

export default DocumentList