'use client'

import DocumentUpload from '@/components/documents/DocumentUpload'
import DocumentList from '@/components/documents/DocumentList'
import { useDocuments } from '@/hooks/useDocuments'
import { motion } from 'framer-motion'

export default function DocumentsPage() {
  const { documents, loading, uploadDocument, deleteDocument } = useDocuments()
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="border-b border-green-500 border-opacity-30 pb-4">
        <h1 className="text-3xl font-bold text-red-500 mb-2 glitch-text">
          HAWKINS LAB FILES
        </h1>
        <p className="text-green-500">
          {`>_ Upload Mr. Clarke's documents for AI analysis`}
        </p>
      </div>
      
      {/* Upload Section */}
      <section>
        <DocumentUpload onUpload={uploadDocument} />
      </section>
      
      {/* Documents List */}
      <section>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-500">
            {`>_ STORED DOCUMENTS [${documents.length}]`}
          </h2>
          <div className="text-xs text-green-500 border border-green-500 px-2 py-1">
            {loading ? 'SYNCING...' : 'DATABASE ONLINE'}
          </div>
        </div>
        
        <DocumentList 
          documents={documents} 
          onDelete={deleteDocument}
          loading={loading}
        />
      </section>
    </motion.div>
  )
}