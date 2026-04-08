'use client'

import { useEffect, useRef, useState } from 'react'

interface Props {
  url: string
  title?: string
}

export default function MusicPlayer({ url, title }: Props) {
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
        className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-stone-800 border border-gold-500 text-gold-400 flex items-center justify-center shadow-lg hover:bg-gold-500 hover:text-white transition-all duration-300"
        title={title || 'Music'}
      >
        {playing ? '♪' : '▶'}
      </button>
    </>
  )
}