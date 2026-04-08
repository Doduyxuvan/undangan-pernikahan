import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans, Great_Vibes } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-serif',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
})

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-script',
})

export const metadata: Metadata = {
  title: 'Undangan Pernikahan',
  description: 'Kami mengundang Anda untuk menyaksikan momen bahagia kami',
  openGraph: {
    type: 'website',
    title: 'Undangan Pernikahan',
    description: 'Kami mengundang Anda untuk menyaksikan momen bahagia kami',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${cormorant.variable} ${dmSans.variable} ${greatVibes.variable} font-sans bg-cream-50`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  )
}