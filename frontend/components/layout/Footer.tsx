'use client'

import { useState, useEffect } from 'react'

const Footer = () => {
  const [systemStatus, setSystemStatus] = useState('OPERATIONAL')
  
  return (
    <footer className="border-t-2 border-green-500 bg-black bg-opacity-90 mt-auto">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center text-xs text-green-500">
          <div className="space-x-4">
            <span>HAWKINS NATIONAL LABORATORY</span>
            <span>|</span>
            <span className="text-red-500">CLASSIFIED BRIEFING SYSTEM</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span>AI STATUS:</span>
              <span className="text-green-500 font-bold">{systemStatus}</span>
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            </div>
            
            <div className="border-l border-green-500 pl-4">
              <span>v1.0 | </span>
              <span className="text-red-500">STRANGER THINGS</span>
              <span> - AV CLUB</span>
            </div>
          </div>
        </div>
        
        {/* Hidden Message */}
        <div className="mt-2 text-[8px] text-green-500 text-opacity-30 text-center">
          {`>_ SYSTEM INITIALIZED FOR MR. CLARKE'S EMERGENCY BRIEFING PROTOCOL`}
        </div>
      </div>
    </footer>
  )
}

export default Footer