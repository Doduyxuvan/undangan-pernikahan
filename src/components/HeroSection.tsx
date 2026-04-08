'use client'

import type { WeddingInfo } from '@/types'

export default function HeroSection({ info }: { info: WeddingInfo }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-stone-900">
      {/* Background image */}

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-stone-900/40 via-transparent to-stone-900/80" />

      {/* Decorative circles */}
      <div className="absolute top-20 left-10 w-32 h-32 rounded-full border border-gold-500/20 animate-pulse-slow" />
      <div className="absolute bottom-32 right-10 w-48 h-48 rounded-full border border-gold-500/10 animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-6">
        <p className="font-sans text-gold-400 text-xs tracking-[0.5em] uppercase mb-8 animate-fade-in">
          The Wedding of
        </p>

        <div className="ornament-divider mb-8">
          <span className="text-gold-500 text-lg">✦</span>
        </div>

        <h1 className="font-script text-8xl md:text-9xl text-white leading-none animate-fade-up">
          {info.groom_name}
        </h1>
        <p className="font-serif text-gold-400 text-3xl my-3 animate-fade-in">&</p>
        <h1 className="font-script text-8xl md:text-9xl text-white leading-none animate-fade-up">
          {info.bride_name}
        </h1>

        <div className="ornament-divider mt-8 mb-6">
          <span className="text-gold-500 text-lg">✦</span>
        </div>

        <p className="font-serif text-stone-300 text-lg animate-fade-in">
          {new Date(info.reception_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-float">
        <div className="w-px h-12 bg-gradient-to-b from-transparent to-gold-500" />
        <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
      </div>
    </section>
  )
}