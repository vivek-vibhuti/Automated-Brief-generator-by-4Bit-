'use client'

import { Reference } from '@/types'
import { motion } from 'framer-motion'
import { FiFileText } from 'react-icons/fi'

interface ReferencesListProps {
  references: Reference[]
}

const ReferencesList = ({ references }: ReferencesListProps) => {
  if (!references || references.length === 0) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="retro-card p-6"
    >
      <h2 className="text-xl font-bold text-green-500 mb-4 glitch-text">
        {`>_ SOURCE REFERENCES`}
      </h2>

      <div className="space-y-4">
        {references.map((ref, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border-l-2 border-green-500 pl-4 py-2
                       hover:border-red-500 transition-colors"
          >
            <div className="flex items-start space-x-3">
              <FiFileText className="text-green-500 mt-1 flex-shrink-0" />
              <div>
                <p className="text-green-500 font-bold">
                  {ref.source}
                  {ref.page && <span className="text-red-500 ml-2">[Page {ref.page}]</span>}
                </p>
                <p className="text-green-400 text-sm mt-1 opacity-80">
                  &quot;{ref.snippet}&quot;
                </p>
                {ref.relevance && (
                  <p className="text-xs text-green-500 mt-2 opacity-50">
                    Relevance: {Math.round(ref.relevance * 100)}%
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 text-xs text-green-500 text-opacity-50 border-t border-green-500 border-opacity-20 pt-4">
        {`>_ Citations from Mr. Clarke's documents`}
      </div>
    </motion.div>
  )
}

export default ReferencesList