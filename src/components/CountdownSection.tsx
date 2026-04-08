'use client'

import { useEffect, useState } from 'react'
import type { WeddingInfo } from '@/types'

function pad(n: number) { return String(n).padStart(2, '0') }

export default function CountdownSection({ info }: { info: WeddingInfo }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0, passed: false })

  useEffect(() => {
    const target = new Date(`${info.reception_date}T${info.reception_time || '00:00'}:00`)
    const calc = () => {
      const now = new Date()
      const diff = target.getTime() - now.getTime()
      if (diff <= 0) { setTimeLeft(t => ({ ...t, passed: true })); return }
      setTimeLeft({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
        passed: false,
      })
    }
    calc()
    const id = setInterval(calc, 1000)
    return () => clearInterval(id)
  }, [info])

  return (
    <section className="py-20 bg-stone-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5"
        style={{ backgroundImage: 'repeating-linear-gradient(45deg, #d4891a 0, #d4891a 1px, transparent 0, transparent 50%)', backgroundSize: '20px 20px' }} />

      <div className="relative z-10 text-center px-6">
        <p className="section-title text-gold-400">Menuju Hari Bahagia</p>
        <p className="font-serif text-stone-400 mb-12">
          {new Date(info.reception_date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>

        {timeLeft.passed ? (
          <p className="font-serif text-gold-300 text-2xl">Hari yang dinantikan telah tiba! 🎊</p>
        ) : (
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap">
            {[
              { val: timeLeft.days, label: 'Hari' },
              { val: timeLeft.hours, label: 'Jam' },
              { val: timeLeft.minutes, label: 'Menit' },
              { val: timeLeft.seconds, label: 'Detik' },
            ].map(({ val, label }, i) => (
              <div key={label} className="flex items-center gap-2 md:gap-4">
                <div className="countdown-box">
                  <span className="font-serif text-4xl md:text-5xl text-gold-500 font-light leading-none">{pad(val)}</span>
                  <span className="font-sans text-stone-400 text-xs mt-2 tracking-widest uppercase">{label}</span>
                </div>
                {i < 3 && <span className="text-gold-500 text-3xl font-serif self-start mt-2">:</span>}
              </div>
            ))}
          </div>
        )}

        {info.live_streaming_url && (
          <div className="mt-12">
            <p className="font-sans text-stone-400 text-sm mb-4">Tidak bisa hadir? Saksikan secara online</p>
            <a href={info.live_streaming_url} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 border border-gold-500 text-gold-400 px-6 py-3 rounded-full font-sans text-sm hover:bg-gold-500 hover:text-white transition-all">
              <span>▶</span> Tonton Live Streaming
            </a>
          </div>
        )}
      </div>
    </section>
  )
}