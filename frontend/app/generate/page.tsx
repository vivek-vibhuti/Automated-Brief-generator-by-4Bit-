'use client'

import { useState, useEffect } from 'react'
import QueryForm from '@/components/presentation/QueryForm'
import SlideCard from '@/components/presentation/SlideCard'
import ReferencesList from '@/components/presentation/ReferencesList'
import { useSlideStream } from '@/hooks/useSlideStream'
import { useDocuments } from '@/hooks/useDocuments'
import { motion, AnimatePresence } from 'framer-motion'

// Define types
interface Slide {
  title: string;
  bullets?: string[];
  sources?: string[];
  chart?: any;
}

interface Reference {
  source: string;
  page: string;
  snippet: string;
}

export default function GeneratePage() {
  const { documents } = useDocuments()
  const { slides, done, loading, error, generate, stop } = useSlideStream()
  
  const [query, setQuery] = useState('')
  const [selectedDocs, setSelectedDocs] = useState<number[]>([])
  const [slideCount, setSlideCount] = useState(5)
  const [provider, setProvider] = useState<'gemini' | 'groq'>('gemini')
  const [sessionId] = useState(() => `session_${Date.now()}`)
  const [showReferences, setShowReferences] = useState(false)
  const [references, setReferences] = useState<Reference[]>([])
  const [editedSlides, setEditedSlides] = useState<Slide[]>([])

  // Update editedSlides when slides change
  useEffect(() => {
    if (slides.length > 0) {
      setEditedSlides(slides.map(s => ({...s})))
    }
  }, [slides])

  // Extract references from slides when done
  useEffect(() => {
    if (done && slides.length > 0) {
      // Collect all unique sources from slides
      const allSources = slides.flatMap(s => s.sources || [])
      const uniqueSources = [...new Set(allSources)].map(source => ({
        source: source.split(' p.')[0] || source,
        page: source.includes('p.') ? source.split(' p.')[1] : '',
        snippet: `Referenced in slide ${slides.findIndex(s => s.sources?.includes(source)) + 1}`
      }))
      setReferences(uniqueSources)
    }
  }, [done, slides])

  const handleSubmit = async (data: any) => {
    setQuery(data.query)
    setSelectedDocs(data.document_ids || [])
    setSlideCount(data.slide_count || 5)
    setProvider(data.llm_provider || 'gemini')
    setShowReferences(false)
    setReferences([])
    
    // Start streaming generation
    generate(sessionId, data.query, data.document_ids || [], data.llm_provider || 'gemini')
  }

  const handleStop = () => {
    stop()
  }

  const handleDownloadHTML = () => {
    try {
      const htmlContent = generateHTMLFromSlides(slides)
      const blob = new Blob([htmlContent], { type: 'text/html' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hawkins-briefing-${Date.now()}.html`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('HTML download error:', err)
      alert('Failed to download HTML')
    }
  }

  const handleDownloadPPTX = async () => {
    try {
      console.log('Downloading PPTX...', slides.length, 'slides')
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/presentations/export/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ slides }),
      })
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Failed to export')
      }
      
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hawkins-briefing-${Date.now()}.pptx`
      a.click()
      URL.revokeObjectURL(url)
      
      console.log('PPTX download completed')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error'
      console.error('PPTX export error:', err)
      alert(`Failed to download PowerPoint: ${message}`)
    }
  }

  const handleDownloadEditable = () => {
    try {
      const editableData = {
        slides: editedSlides,
        metadata: {
          generated: new Date().toISOString(),
          query: query,
          documentCount: selectedDocs.length
        }
      }
      
      const blob = new Blob([JSON.stringify(editableData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `hawkins-briefing-editable-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Editable download error:', err)
      alert('Failed to download editable JSON')
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-12"
    >
      {/* Header */}
      <div className="border-b border-green-500 border-opacity-30 pb-4">
        <h1 className="text-3xl font-bold text-red-500 mb-2 glitch-text">
          GENERATE BRIEFING
        </h1>
        <p className="text-green-500">
          {`>_ Watch slides appear in real-time as Mr. Clarke's AI thinks`}
        </p>
      </div>

      {/* Query Form */}
      <section>
        <QueryForm 
          onSubmit={handleSubmit} 
          generating={loading} 
          documents={documents}
          initialQuery={query}
        />
      </section>

      {/* Live Status Bar (only when generating) */}
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="retro-card p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-0 w-4 h-4 border-2 border-green-500 border-b-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
              </div>
              <div>
                <span className="text-green-500 font-bold">STREAMING SLIDES...</span>
                <span className="text-green-500 text-sm ml-4">
                  {slides.length} slide{slides.length !== 1 ? 's' : ''} generated
                </span>
              </div>
            </div>
            <button
              onClick={handleStop}
              className="border border-red-500 px-4 py-2 text-red-500
                       hover:bg-red-500 hover:bg-opacity-10 transition-all"
            >
              [ STOP ]
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Display */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="border-2 border-red-500 p-4 bg-red-500 bg-opacity-10"
          >
            <p className="text-red-500 font-bold">SYSTEM ERROR:</p>
            <p className="text-red-400 text-sm">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Streaming Slides */}
      {slides.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-green-500 border-b border-green-500 border-opacity-30 pb-2">
            {`>_ LIVE GENERATION (${slides.length} slide${slides.length !== 1 ? 's' : ''})`}
          </h2>
          
          <AnimatePresence>
            {slides.map((slide, index) => (
              <SlideCard 
                key={`slide-${index}-${Date.now()}`} 
                slide={slide} 
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Completion & Actions */}
      <AnimatePresence>
        {done && slides.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            {/* Success Message */}
            <div className="text-center py-6 border-2 border-green-500 border-dashed">
              <p className="text-green-500 text-2xl mb-2">✅ BRIEFING COMPLETE</p>
              <p className="text-green-500 text-sm opacity-70">
                {slides.length} slides generated from your documents
              </p>
            </div>

            {/* References Toggle */}
            {references.length > 0 && (
              <div>
                <button
                  onClick={() => setShowReferences(!showReferences)}
                  className="flex items-center space-x-2 text-green-500 hover:text-red-500 transition-colors"
                >
                  <span className="text-xl">{showReferences ? '▼' : '▶'}</span>
                  <span>[ {showReferences ? 'HIDE' : 'SHOW'} SOURCE REFERENCES ]</span>
                </button>
                
                <AnimatePresence>
                  {showReferences && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <ReferencesList references={references} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Download Options */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-green-500 border-opacity-30 flex-wrap gap-4">
              <button
                onClick={handleDownloadHTML}
                className="border border-green-500 px-6 py-2 text-green-500
                         hover:bg-green-500 hover:bg-opacity-10 transition-all
                         flex items-center space-x-2"
              >
                <span>📄</span>
                <span>[ DOWNLOAD HTML ]</span>
              </button>
              
              <button
                onClick={handleDownloadPPTX}
                className="border border-green-500 px-6 py-2 text-green-500
                         hover:bg-green-500 hover:bg-opacity-10 transition-all
                         flex items-center space-x-2"
              >
                <span>📊</span>
                <span>[ DOWNLOAD POWERPOINT ]</span>
              </button>

              <button
                onClick={handleDownloadEditable}
                className="border border-green-500 px-6 py-2 text-green-500
                         hover:bg-green-500 hover:bg-opacity-10 transition-all
                         flex items-center space-x-2"
              >
                <span>📝</span>
                <span>[ DOWNLOAD EDITABLE JSON ]</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Helper function to generate HTML from slides
function generateHTMLFromSlides(slides: Slide[]): string {
  const slidesHTML = slides.map((slide, index) => `
    <section>
      <h2>${slide.title || `Slide ${index + 1}`}</h2>
      <ul>
        ${slide.bullets?.map((bullet: string) => `<li>${bullet}</li>`).join('') || '<li>No content</li>'}
      </ul>
      ${slide.sources?.length ? `
        <div class="sources">
          <small>Sources: ${slide.sources.join(' • ')}</small>
        </div>
      ` : ''}
    </section>
  `).join('')

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Hawkins Briefing</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.4.0/reveal.min.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.4.0/theme/black.css">
  <style>
    .reveal .slides section { text-align: left; }
    .reveal .slides section h2 { color: #ff6b6b; }
    .sources { margin-top: 30px; font-size: 0.5em; color: #888; }
  </style>
</head>
<body>
  <div class="reveal">
    <div class="slides">
      ${slidesHTML}
    </div>
  </div>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/reveal.js/4.4.0/reveal.js"></script>
  <script>Reveal.initialize({ transition: 'slide', fragments: true });</script>
</body>
</html>`
}