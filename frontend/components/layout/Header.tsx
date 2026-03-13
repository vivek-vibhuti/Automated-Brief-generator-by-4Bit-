'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

const Header = () => {
  const pathname = usePathname()
  const [time, setTime] = useState('')
  
  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString('en-US', { 
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }))
    }
    
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])
  
  const navItems = [
    { href: '/', label: 'TERMINAL' },
    { href: '/documents', label: 'FILES' },
    { href: '/generate', label: 'GENERATE' },
  ]
  
  return (
    <header className="border-b-2 border-green-500 bg-black bg-opacity-90">
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center py-2 text-xs text-green-500 border-b border-green-500 border-opacity-30">
          <div className="flex space-x-4">
            <span>HAWKINS LABS</span>
            <span>CLASSIFIED</span>
            <span>AV CLUB TERMINAL</span>
          </div>
          <div className="flex space-x-4">
            <span>SYSTEM: ONLINE</span>
            <span className="text-red-500 animate-pulse">{time}</span>
          </div>
        </div>
        
        {/* Main Navigation */}
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="group">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-2xl font-bold"
            >
              <span className="text-red-500">MR.</span>
              <span className="text-green-500">CLARKE's</span>
              <span className="text-blue-500 ml-2">BRIEFING</span>
            </motion.div>
            <div className="text-xs text-green-500 mt-1 glitch-text">
              {`>_ AUTOMATED PRESENTATION GENERATOR v1.0`}
            </div>
          </Link>
          
          <nav className="flex space-x-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-4 py-2 text-sm font-bold transition-all duration-300 
                  ${pathname === item.href 
                    ? 'text-red-500 border-2 border-red-500' 
                    : 'text-green-500 border-2 border-green-500 border-opacity-30 hover:border-opacity-100'
                  }`}
              >
                {`[ ${item.label} ]`}
                {pathname === item.href && (
                  <motion.div
                    layoutId="activeNav"
                    className="absolute inset-0 border-2 border-red-500"
                    transition={{ type: 'spring', duration: 0.5 }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Status Bar */}
        <div className="flex space-x-6 py-2 text-xs border-t border-green-500 border-opacity-30">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span>CONNECTION SECURE</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></span>
            <span>AI ENGINE: ONLINE</span>
          </div>
          <div className="flex items-center space-x-2">
            <span>DOCUMENTS: 0</span>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header