'use client'

import { Document } from '@/types'
import { FiFile, FiTrash2, FiCheckCircle, FiClock } from 'react-icons/fi'
import { formatDistanceToNow } from 'date-fns'
import { motion } from 'framer-motion'

interface DocumentCardProps {
  document: Document
  onDelete: (id: number) => void
}

const DocumentCard = ({ document, onDelete }: DocumentCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="border border-green-500 border-opacity-30 p-4 
                 hover:border-opacity-100 transition-all duration-300
                 bg-black bg-opacity-50"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3">
          <FiFile className="text-green-500 text-xl mt-1" />
          <div>
            <h3 className="text-green-500 font-bold">{document.title}</h3>
            <div className="flex items-center space-x-4 mt-2 text-xs">
              <span className="text-green-500 text-opacity-70">
                ID: {document.id}
              </span>
              <span className="flex items-center space-x-1">
                {document.processed ? (
                  <>
                    <FiCheckCircle className="text-green-500" />
                    <span className="text-green-500">Processed</span>
                  </>
                ) : (
                  <>
                    <FiClock className="text-yellow-500" />
                    <span className="text-yellow-500">Processing</span>
                  </>
                )}
              </span>
            </div>
            <div className="mt-2 text-xs text-green-500 text-opacity-50">
              Uploaded: {formatDistanceToNow(new Date(document.uploaded_at))} ago
            </div>
          </div>
        </div>
        
        <button
          onClick={() => onDelete(document.id)}
          className="text-red-500 hover:text-red-400 transition-colors p-2
                     border border-red-500 border-opacity-30 hover:border-opacity-100"
        >
          <FiTrash2 />
        </button>
      </div>
    </motion.div>
  )
}

export default DocumentCard