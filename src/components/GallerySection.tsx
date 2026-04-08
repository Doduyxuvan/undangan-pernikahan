'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import type { GalleryPhoto } from '@/types'

export default function GallerySection() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [lightbox, setLightbox] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`)
        return r.json()
      })
      .then(data => {
        if (Array.isArray(data)) setPhotos(data)
        else throw new Error('Data bukan array')
      })
      .catch(err => {
        console.warn('Gallery fetch error:', err)
        setError(err.message)
      })
      .finally(() => setLoading(false))
  }, [])

  // Loading state
  if (loading) return (
    <section className="py-24 bg-stone-100 text-center">
      <p className="text-stone-400 text-sm">Memuat galeri...</p>
    </section>
  )

  // Sembunyikan section kalau memang belum ada foto (bukan error)
  if (!error && photos.length === 0) return null

  // Tampilkan error kalau fetch gagal
  if (error) return (
    <section className="py-24 bg-stone-100 text-center">
      <p className="text-red-400 text-sm">Gagal memuat galeri: {error}</p>
    </section>
  )

  return (
    <section className="py-24 bg-stone-100">
      <div className="max-w-5xl mx-auto px-6">
        <p className="section-title">Galeri Foto</p>
        <p className="section-subtitle">Setiap momen yang kami abadikan bersama</p>

        <div className="grid grid-cols-2 md:grid-cols-3 auto-rows-[200px] gap-3">
          {photos.map((photo, i) => (
            <div
              key={photo.id}
              className={`relative overflow-hidden rounded-xl cursor-pointer group ${
                i === 0 ? 'col-span-2 row-span-2' : ''
              }`}
              onClick={() => setLightbox(photo.url)}
            >
              <Image
                src={photo.url}
                alt={photo.caption || `Foto ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              {photo.caption && (
                <div className="absolute inset-0 bg-stone-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                  <p className="font-sans text-white text-xs">{photo.caption}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightbox(null)}
        >
          <div className="relative max-w-4xl max-h-screen w-full h-full">
            <Image src={lightbox} alt="Preview" fill className="object-contain" />
          </div>
          <button
            className="absolute top-4 right-4 text-white text-3xl hover:text-gold-400"
            onClick={() => setLightbox(null)}
          >✕</button>
        </div>
      )}
    </section>
  )
}