'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'

interface PresentationViewerProps {
  slidesHtml: string
}

const PresentationViewer = ({ slidesHtml }: PresentationViewerProps) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  
  useEffect(() => {
    // Auto-adjust iframe height
    const handleIframeLoad = () => {
      if (iframeRef.current) {
        const iframe = iframeRef.current
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          const height = iframeDoc.documentElement.scrollHeight
          iframe.style.height = `${height}px`
        }
      }
    }
    
    const iframe = iframeRef.current
    if (iframe) {
      iframe.addEventListener('load', handleIframeLoad)
      return () => iframe.removeEventListener('load', handleIframeLoad)
    }
  }, [slidesHtml])
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="retro-card p-4"
    >
      <div className="flex items-center justify-between mb-4 border-b border-green-500 border-opacity-30 pb-2">
        <h2 className="text-xl font-bold text-green-500">
          {`>_ LIVE BRIEFING`}
        </h2>
        <div className="flex items-center space-x-2 text-xs">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          <span className="text-green-500">REVEAL.JS ACTIVE</span>
        </div>
      </div>
      
      <iframe
        ref={iframeRef}
        srcDoc={slidesHtml}
        className="w-full border-2 border-green-500 bg-black"
        style={{ minHeight: '500px' }}
        title="Presentation"
        sandbox="allow-scripts allow-same-origin"
      />
      
      <div className="mt-4 text-xs text-green-500 text-opacity-50">
        {`>_ Use arrow keys to navigate | Press 'ESC' for overview`}
      </div>
    </motion.div>
  )
}

export default PresentationViewer