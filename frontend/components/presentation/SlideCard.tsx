'use client'

import { useEffect, useRef } from 'react'
import { Chart, ChartConfiguration } from 'chart.js/auto'
import { Slide } from '@/hooks/useSlideStream'
import { motion } from 'framer-motion'

interface SlideCardProps {
  slide: Slide
  index: number
  onEdit?: (index: number) => void
}

export default function SlideCard({ slide, index, onEdit }: SlideCardProps) {
  const chartRef = useRef<HTMLCanvasElement | null>(null)
  const chartInstanceRef = useRef<Chart | null>(null)

  useEffect(() => {
    if (!slide.chart || !chartRef.current) return

    const ctx = chartRef.current.getContext('2d')
    if (!ctx) return

    // Destroy existing chart
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy()
    }

    const config: ChartConfiguration = {
      type: (slide.chart.type as unknown) || 'bar',
      data: {
        labels: slide.chart.labels || ['A', 'B', 'C', 'D'],
        datasets: [
          {
            label: 'Data',
            data: slide.chart.data || [1, 2, 3, 4],
            backgroundColor: '#00ff00',
            borderColor: '#00ff00',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            labels: {
              color: '#00ff00'
            }
          }
        },
        scales: {
          y: {
            ticks: {
              color: '#00ff00'
            }
          },
          x: {
            ticks: {
              color: '#00ff00'
            }
          }
        }
      }
    }

    chartInstanceRef.current = new Chart(ctx, config)

    return () => {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy()
        chartInstanceRef.current = null
      }
    }
  }, [slide.chart])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.15 }}
      className="retro-card p-6 mb-6 border-2 border-green-500 relative group"
    >
      {onEdit && (
        <button
          onClick={() => onEdit(index)}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity
          bg-black border border-green-500 px-3 py-1 text-green-500 z-10
          hover:bg-green-500 hover:text-black"
        >
          ✎ Edit
        </button>
      )}

      <h2 className="text-2xl font-bold text-red-500 mb-4 glitch-text pr-16">
        {slide.title}
      </h2>

      <ul className="space-y-2 mb-4">
        {slide.bullets?.map((bullet, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.15 + i * 0.1 }}
            className="text-green-500 flex items-start"
          >
            <span className="mr-2">•</span>
            <span>{bullet}</span>
          </motion.li>
        ))}
      </ul>

      {slide.chart && (
        <div className="my-6 h-64">
          <canvas ref={chartRef} />
        </div>
      )}

      {slide.sources && slide.sources.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.15 + 0.5 }}
          className="mt-4 pt-4 border-t border-green-500 border-opacity-30 text-xs text-green-500"
        >
          <span className="font-bold">Sources:</span>{' '}
          {slide.sources.join(' • ')}
        </motion.div>
      )}
    </motion.div>
  )
}