'use client'

import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import type { WeddingInfo } from '@/types'

function OpeningCoverInner({ info, onOpen }: { info: WeddingInfo; onOpen: () => void }) {
  const searchParams = useSearchParams()
  const guestName = searchParams.get('tamu')

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-stone-900 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, #d4891a 0%, transparent 50%), radial-gradient(circle at 80% 20%, #9f1239 0%, transparent 50%)' }} />

      {/* Ornament corners */}
      <div className="absolute top-4 left-4 text-gold-400 text-4xl opacity-60">❧</div>
      <div className="absolute top-4 right-4 text-gold-400 text-4xl opacity-60 scale-x-[-1]">❧</div>
      <div className="absolute bottom-4 left-4 text-gold-400 text-4xl opacity-60 rotate-180 scale-x-[-1]">❧</div>
      <div className="absolute bottom-4 right-4 text-gold-400 text-4xl opacity-60 rotate-180">❧</div>

      <div className="text-center px-8 animate-fade-in">
        <p className="font-sans text-gold-300 text-xs tracking-[0.4em] uppercase mb-6">Undangan Pernikahan</p>
        
        <div className="w-16 h-px bg-gold-500 mx-auto mb-6 opacity-60" />

        <h1 className="font-script text-7xl md:text-8xl text-white mb-2 leading-none">
          {info.groom_name}
        </h1>
        <p className="font-serif text-gold-400 text-2xl mb-2">&</p>
        <h1 className="font-script text-7xl md:text-8xl text-white mb-8 leading-none">
          {info.bride_name}
        </h1>

        <div className="w-16 h-px bg-gold-500 mx-auto mb-8 opacity-60" />

        {guestName && (
          <div className="mb-8">
            <p className="font-sans text-stone-400 text-xs tracking-widest uppercase mb-1">Kepada Yth.</p>
            <p className="font-serif text-gold-300 text-xl">{guestName}</p>
          </div>
        )}

        <p className="font-sans text-stone-400 text-sm mb-10 max-w-xs mx-auto leading-relaxed">
          Bersama keluarga kami mengundang kehadiran Anda untuk menyaksikan momen bahagia kami
        </p>

        <button
          onClick={onOpen}
          className="group relative inline-flex items-center gap-3 border border-gold-500 text-gold-400 px-8 py-4 rounded-full font-sans text-sm tracking-widest uppercase hover:bg-gold-500 hover:text-white transition-all duration-300"
        >
          <span className="text-base">✉</span>
          Buka Undangan
        </button>
      </div>
    </div>
  )
}

export default function OpeningCover({ info, onOpen }: { info: WeddingInfo; onOpen: () => void }) {
  return (
    <Suspense fallback={null}>
      <OpeningCoverInner info={info} onOpen={onOpen} />
    </Suspense>
  )
}