import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Mr. Clarke\'s Briefing Generator',
  description: 'AI-powered presentation generator for Hawkins AV Club',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.ico" />
      </head>
      <body className={`${inter.className} crt`}>
        <div className="min-h-screen flex flex-col relative">
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          <Footer />
        </div>
        <Toaster 
          position="bottom-right"
          toastOptions={{
            style: {
              background: '#000',
              color: '#00ff00',
              border: '2px solid #00ff00',
              borderRadius: '0',
            },
          }}
        />
      </body>
    </html>
  )
}