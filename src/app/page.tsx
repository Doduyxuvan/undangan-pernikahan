'use client'

import { useEffect, useState, Suspense, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import type { WeddingInfo } from '@/types'
import OpeningCover from '@/components/OpeningCover'
import HeroSection from '@/components/HeroSection'
import CoupleSection from '@/components/CoupleSection'
import EventSection from '@/components/EventSection'
import CountdownSection from '@/components/CountdownSection'
import GallerySection from '@/components/GallerySection'
import RSVPSection from '@/components/RSVPSection'
import AmplopSection from '@/components/AmplopSection'

const defaultWeddingInfo: WeddingInfo = {
  id: '1',
  groom_name: 'Budi',
  bride_name: 'Siti',
  groom_full_name: 'Muhammad Budi Santoso',
  bride_full_name: 'Siti Rahayu Putri',
  groom_parents: 'Putra dari Bapak Ahmad & Ibu Fatimah',
  bride_parents: 'Putri dari Bapak Hendra & Ibu Dewi',
  akad_date: '2025-06-14',
  akad_time: '08:00',
  akad_venue: 'Masjid Al-Ikhlas',
  akad_address: 'Jl. Mawar No. 10, Jakarta Selatan',
  reception_date: '2025-06-14',
  reception_time: '11:00',
  reception_venue: 'Gedung Serbaguna Mulia',
  reception_address: 'Jl. Melati No. 25, Jakarta Selatan',
  maps_url: '',
  maps_embed: '',
  live_streaming_url: '',
  backsound_url: '',
  backsound_title: '',
  bank_accounts: [],
  hero_image_url: '',
  story: '',
  updated_at: new Date().toISOString(),
}

// ── Music Player (inline, tidak perlu file terpisah) ──────────────────────────
function MusicPlayer({ url, title }: { url: string; title?: string }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [playing, setPlaying] = useState(true)

  useEffect(() => {
    if (!url || !audioRef.current) return
    audioRef.current.volume = 0.5
    audioRef.current.play().catch(() => setPlaying(false))
  }, [url])

  const toggle = () => {
    if (!audioRef.current) return
    if (playing) {
      audioRef.current.pause()
      setPlaying(false)
    } else {
      audioRef.current.play()
      setPlaying(true)
    }
  }

  if (!url) return null

  return (
    <>
      <audio ref={audioRef} src={url} loop preload="auto" />
      <button
        onClick={toggle}
        title={title || 'Music'}
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-stone-800 border border-gold-500 text-gold-400 flex items-center justify-center shadow-lg hover:bg-gold-500 hover:text-white transition-all duration-300 text-lg"
      >
        {playing ? '♪' : '▶'}
      </button>
    </>
  )
}
// ─────────────────────────────────────────────────────────────────────────────

function HomePageInner() {
  const searchParams = useSearchParams()
  const guestName = searchParams.get('tamu') || undefined

  const [info, setInfo] = useState<WeddingInfo>(defaultWeddingInfo)
  const [opened, setOpened] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchWeddingInfo() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        if (!supabaseUrl || supabaseUrl === 'https://your-project.supabase.co') {
          setInfo(defaultWeddingInfo)
          setLoading(false)
          return
        }
        const { data, error } = await supabase
          .from('wedding_info')
          .select('*')
          .single()
        if (error) throw error
        if (data) setInfo(data)
      } catch (err) {
        console.warn('Menggunakan data default:', err)
        setInfo(defaultWeddingInfo)
      } finally {
        setLoading(false)
      }
    }
    fetchWeddingInfo()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-900">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="font-serif text-gold-400 text-sm tracking-widest">Memuat undangan...</p>
        </div>
      </div>
    )
  }

  return (
    <>
      {!opened && <OpeningCover info={info} onOpen={() => setOpened(true)} />}
      {opened && <MusicPlayer url={info.backsound_url || ''} title={info.backsound_title || ''} />}
      <main className={opened ? 'block' : 'hidden'}>
        <HeroSection info={info} />
        <CoupleSection info={info} />
        <EventSection info={info} />
        <CountdownSection info={info} />
        <GallerySection />
        <AmplopSection info={info} />
        <RSVPSection guestName={guestName} />
        <footer className="py-12 bg-stone-900 text-center">
          <p className="font-script text-4xl text-gold-400 mb-2">{info.groom_name} & {info.bride_name}</p>
          <p className="font-sans text-stone-500 text-xs tracking-widest uppercase">Dengan Cinta & Doa</p>
        </footer>
      </main>
    </>
  )
}

export default function HomePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-stone-900">
        <div className="w-12 h-12 border-2 border-gold-500 border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <HomePageInner />
    </Suspense>
  )
}