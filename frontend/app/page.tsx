'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FiUpload, FiCpu, FiFileText } from 'react-icons/fi'

export default function HomePage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      {/* Hero Section */}
      <section className="text-center py-12 border-b-2 border-green-500 border-opacity-30">
        <motion.h1 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-5xl font-bold mb-4 glitch-text"
        >
          MR. CLARKE'S
        </motion.h1>
        <motion.h2 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-3xl text-green-500 mb-6"
        >
          AUTOMATED BRIEFING GENERATOR
        </motion.h2>
        <motion.p 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-green-500 max-w-2xl mx-auto"
        >
          {`>_ Transform Mr. Clarke's documents into animated presentations`}
        </motion.p>
      </section>
      
      {/* Features Grid */}
      <section className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<FiUpload className="text-4xl" />}
          title="UPLOAD DOCUMENTS"
          description="Upload PDFs, text files, and research notes from Mr. Clarke's collection"
          href="/documents"
          delay={0.3}
        />
        <FeatureCard
          icon={<FiCpu className="text-4xl" />}
          title="AI PROCESSING"
          description="Advanced RAG system extracts and organizes information"
          href="/generate"
          delay={0.4}
        />
        <FeatureCard
          icon={<FiFileText className="text-4xl" />}
          title="ANIMATED SLIDES"
          description="Generate Reveal.js presentations with automatic animations"
          href="/generate"
          delay={0.5}
        />
      </section>
      
      {/* Status Display */}
      <section className="retro-card p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-red-500 font-bold mb-4">SYSTEM STATUS</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-500">AI Core:</span>
                <span className="text-green-500">ONLINE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-500">Document Store:</span>
                <span className="text-green-500">ACTIVE</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-500">Vector DB:</span>
                <span className="text-green-500">CONNECTED</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-red-500 font-bold mb-4">HAWKINS ALERT</h3>
            <p className="text-green-500 text-sm">
              {`>_ Strange signals detected. Mr. Clarke's documents may contain answers.`}
            </p>
            <p className="text-green-500 text-xs mt-4 opacity-50">
              {`>_ AV CLUB TERMINAL v1.0 | STRANGER THINGS HACKFEST`}
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

function FeatureCard({ icon, title, description, href, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <Link href={href}>
        <div className="retro-card p-6 text-center group cursor-pointer
                      hover:border-opacity-100 transition-all duration-300">
          <div className="text-green-500 mb-4 group-hover:text-red-500 transition-colors">
            {icon}
          </div>
          <h3 className="text-red-500 font-bold mb-2">{title}</h3>
          <p className="text-green-500 text-sm">{description}</p>
          <div className="mt-4 text-xs text-green-500 opacity-0 group-hover:opacity-100 transition-opacity">
            {`>> ACCESS TERMINAL <<`}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}