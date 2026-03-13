'use client'

import { useState } from 'react'
import QueryForm from '@/components/presentation/QueryForm'
import PresentationViewer from '@/components/presentation/PresentationViewer'
import ReferencesList from '@/components/presentation/ReferencesList'
import { usePresentation } from '@/hooks/usePresentation'
import { motion, AnimatePresence } from 'framer-motion'

export default function GeneratePage() {
  const { generating, presentation, generatePresentation } = usePresentation()
  const [error, setError] = useState<string | null>(null)
  
  const handleSubmit = async (data: any) => {
    try {
      setError(null)
      await generatePresentation(data)
    } catch (err: any) {
      setError(err.message || 'Failed to generate presentation')
    }
  }
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      {/* Header */}
      <div className="border-b border-green-500 border-opacity-30 pb-4">
        <h1 className="text-3xl font-bold text-red-500 mb-2 glitch-text">
          GENERATE BRIEFING
        </h1>
        <p className="text-green-500">
          {`>_ Ask Mr. Clarke's AI to create an animated presentation`}
        </p>
      </div>
      
      {/* Query Form */}
      <section>
        <QueryForm onSubmit={handleSubmit} generating={generating} />
      </section>
      
      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border-2 border-red-500 p-4 bg-red-500 bg-opacity-10"
          >
            <p className="text-red-500 font-bold">ERROR:</p>
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Presentation Results */}
      <AnimatePresence>
        {presentation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <section>
              <PresentationViewer slidesHtml={presentation.slides_html} />
            </section>
            
            <section>
              <ReferencesList references={presentation.references} />
            </section>
            
            {/* Share/Download Options */}
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => {
                  const blob = new Blob([presentation.slides_html], { type: 'text/html' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `hawkins-briefing-${Date.now()}.html`
                  a.click()
                }}
                className="border border-green-500 px-4 py-2 text-green-500
                         hover:bg-green-500 hover:bg-opacity-10 transition-all"
              >
                [ DOWNLOAD HTML ]
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}