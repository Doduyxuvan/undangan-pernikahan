'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import type { WeddingInfo } from '@/types'

export default function AmplopSection({ info }: { info: WeddingInfo }) {
  const [copied, setCopied] = useState<string | null>(null)

  if (!info.bank_accounts || info.bank_accounts.length === 0) return null

  function copyToClipboard(text: string, label: string) {
    navigator.clipboard.writeText(text)
    setCopied(label)
    toast.success('Nomor rekening disalin!')
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <section className="py-24 bg-white">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <p className="section-title">Amplop Digital</p>
        <p className="section-subtitle">
          Bagi yang ingin memberikan tanda kasih, kami sangat berterima kasih atas ketulusan hati Anda
        </p>

        <div className="space-y-4">
          {info.bank_accounts.map((acc, i) => (
            <div key={i} className="card flex items-center justify-between text-left">
              <div>
                <p className="font-sans text-stone-500 text-xs tracking-widest uppercase mb-1">{acc.bank}</p>
                <p className="font-serif text-stone-800 text-2xl tracking-widest">{acc.account_number}</p>
                <p className="font-sans text-stone-500 text-sm">{acc.account_name}</p>
              </div>
              <button
                onClick={() => copyToClipboard(acc.account_number, `${acc.bank}-${i}`)}
                className={`ml-4 flex-shrink-0 px-4 py-2 rounded-full text-xs font-sans border transition-all ${
                  copied === `${acc.bank}-${i}`
                    ? 'bg-gold-500 text-white border-gold-500'
                    : 'border-stone-200 text-stone-500 hover:border-gold-300 hover:text-gold-600'
                }`}
              >
                {copied === `${acc.bank}-${i}` ? '✓ Disalin' : 'Salin'}
              </button>
            </div>
          ))}
        </div>

        <p className="font-sans text-stone-400 text-xs mt-8">
          Kehadiran dan doa restu Anda adalah hadiah terbesar bagi kami
        </p>
      </div>
    </section>
  )
}