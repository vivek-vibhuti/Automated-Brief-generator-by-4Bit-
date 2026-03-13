'use client'

import { useFileUpload } from '@/hooks/useFileUpload'
import { motion, AnimatePresence } from 'framer-motion'
import { FiUpload, FiFile, FiX } from 'react-icons/fi'

interface DocumentUploadProps {
  onUpload: (file: File, title?: string) => Promise<void>
}

const DocumentUpload = ({ onUpload }: DocumentUploadProps) => {
  const {
    file,
    title,
    setTitle,
    uploading,
    isDragActive,
    getRootProps,
    getInputProps,
    handleUpload,
    reset
  } = useFileUpload({ onUpload })
  
  return (
    <div className="retro-card p-6">
      <h2 className="text-xl font-bold text-green-500 mb-4 glitch-text">
        {`>_ UPLOAD DOCUMENTS`}
      </h2>
      
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed p-8 text-center cursor-pointer
          transition-all duration-300
          ${isDragActive 
            ? 'border-green-500 bg-green-500 bg-opacity-10' 
            : 'border-green-500 border-opacity-30 hover:border-opacity-100'
          }
        `}
      >
        <input {...getInputProps()} />
        <FiUpload className="mx-auto text-4xl text-green-500 mb-4" />
        {isDragActive ? (
          <p className="text-green-500">Drop Mr. Clarke's files here...</p>
        ) : (
          <div>
            <p className="text-green-500 mb-2">Drag & drop documents</p>
            <p className="text-xs text-green-500 text-opacity-70">
              Supports: PDF, TXT, DOCX (Max: 10MB)
            </p>
          </div>
        )}
      </div>
      
      {/* File Preview */}
      <AnimatePresence>
        {file && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-6 p-4 border border-green-500 border-opacity-30"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FiFile className="text-green-500 text-xl" />
                <div>
                  <p className="text-green-500 font-bold">{file.name}</p>
                  <p className="text-xs text-green-500 text-opacity-70">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              </div>
              <button
                onClick={reset}
                className="text-red-500 hover:text-red-400 transition-colors"
              >
                <FiX />
              </button>
            </div>
            
            {/* Title Input */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter document title (optional)"
              className="w-full bg-black border border-green-500 border-opacity-30 
                       p-2 text-green-500 placeholder-green-500 placeholder-opacity-30
                       focus:border-opacity-100 focus:outline-none mb-4"
            />
            
            {/* Upload Button */}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="hawkins-button w-full flex items-center justify-center space-x-2"
            >
              {uploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                  <span>PROCESSING...</span>
                </>
              ) : (
                <>
                  <span>UPLOAD TO HAWKINS LAB</span>
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* System Note */}
      <div className="mt-4 text-xs text-green-500 text-opacity-50 border-t border-green-500 border-opacity-20 pt-4">
        {`>_ NOTE: Documents will be analyzed using Hawkins Lab AI systems`}
      </div>
    </div>
  )
}

export default DocumentUpload