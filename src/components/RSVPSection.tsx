'use client'

import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import type { WishEntry } from '@/types'

function WishCard({ wish }: { wish: WishEntry }) {
  return (
    <div className="card text-left">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-gold-100 flex items-center justify-center flex-shrink-0">
          <span className="font-script text-xl text-gold-500">{wish.name[0]}</span>
        </div>
        <div>
          <p className="font-serif text-stone-800 font-medium">{wish.name}</p>
          <p className="font-sans text-stone-500 text-xs mb-2">
            {new Date(wish.created_at).toLocaleDateString('id-ID', {
              day: 'numeric', month: 'long', year: 'numeric'
            })}
          </p>
          <p className="font-sans text-stone-600 text-sm leading-relaxed">{wish.message}</p>
        </div>
      </div>
    </div>
  )
}

export default function RSVPSection({ guestName }: { guestName?: string }) {
  const [wishes, setWishes] = useState<WishEntry[]>([])
  const [rsvpForm, setRsvpForm] = useState({
    guest_name: guestName || '',
    attendance: 'hadir',
    guests_count: 1,
    message: '',
  })
  const [wishForm, setWishForm] = useState({ name: guestName || '', message: '' })
  const [submittingRsvp, setSubmittingRsvp] = useState(false)
  const [submittingWish, setSubmittingWish] = useState(false)
  const [rsvpDone, setRsvpDone] = useState(false)

  useEffect(() => {
    fetchWishes()
  }, [])

  async function fetchWishes() {
    const res = await fetch('/api/wishes')
    const data = await res.json()
    if (Array.isArray(data)) setWishes(data)
  }

  async function submitRsvp() {
    if (!rsvpForm.guest_name) return toast.error('Nama wajib diisi')
    setSubmittingRsvp(true)
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rsvpForm),
      })
      if (!res.ok) throw new Error()
      toast.success('Konfirmasi kehadiran berhasil! 🎉')
      setRsvpDone(true)
    } catch {
      toast.error('Gagal mengirim konfirmasi')
    } finally {
      setSubmittingRsvp(false)
    }
  }

  async function submitWish() {
    if (!wishForm.name || !wishForm.message) return toast.error('Nama dan ucapan wajib diisi')
    setSubmittingWish(true)
    try {
      const res = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(wishForm),
      })
      if (!res.ok) throw new Error()
      toast.success('Ucapan berhasil dikirim! 💌')
      setWishForm({ name: guestName || '', message: '' })
      fetchWishes()
    } catch {
      toast.error('Gagal mengirim ucapan')
    } finally {
      setSubmittingWish(false)
    }
  }

  return (
    <section className="py-24 bg-cream-50">
      <div className="max-w-4xl mx-auto px-6">
        <p className="section-title">RSVP & Ucapan</p>
        <p className="section-subtitle">Konfirmasi kehadiran dan kirimkan doa terbaik Anda</p>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* RSVP Form */}
          <div className="card">
            <h3 className="font-serif text-xl text-stone-800 mb-6">✉ Konfirmasi Kehadiran</h3>

            {rsvpDone ? (
              <div className="text-center py-8">
                <p className="text-4xl mb-3">🎊</p>
                <p className="font-serif text-stone-700">Terima kasih atas konfirmasi Anda!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="font-sans text-stone-500 text-xs tracking-widest uppercase block mb-1">Nama</label>
                  <input
                    type="text"
                    value={rsvpForm.guest_name}
                    onChange={e => setRsvpForm(f => ({ ...f, guest_name: e.target.value }))}
                    placeholder="Nama lengkap Anda"
                    className="w-full border border-stone-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold-400 bg-white"
                  />
                </div>

                <div>
                  <label className="font-sans text-stone-500 text-xs tracking-widest uppercase block mb-2">Kehadiran</label>
                  <div className="flex gap-3">
                    {[
                      { val: 'hadir', label: '✓ Hadir' },
                      { val: 'mungkin', label: '? Mungkin' },
                      { val: 'tidak_hadir', label: '✗ Tidak Hadir' },
                    ].map(opt => (
                      <button
                        key={opt.val}
                        onClick={() => setRsvpForm(f => ({ ...f, attendance: opt.val }))}
                        className={`flex-1 py-2 rounded-full text-xs font-sans border transition-all ${
                          rsvpForm.attendance === opt.val
                            ? 'bg-gold-500 text-white border-gold-500'
                            : 'border-stone-200 text-stone-500 hover:border-gold-300'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {rsvpForm.attendance === 'hadir' && (
                  <div>
                    <label className="font-sans text-stone-500 text-xs tracking-widest uppercase block mb-1">Jumlah Tamu</label>
                    <input
                      type="number"
                      min={1}
                      max={10}
                      value={rsvpForm.guests_count}
                      onChange={e => setRsvpForm(f => ({ ...f, guests_count: parseInt(e.target.value) || 1 }))}
                      className="w-full border border-stone-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold-400 bg-white"
                    />
                  </div>
                )}

                <button
                  onClick={submitRsvp}
                  disabled={submittingRsvp}
                  className="w-full bg-gold-500 text-white py-3 rounded-full font-sans text-sm tracking-widest uppercase hover:bg-gold-600 transition-all disabled:opacity-50"
                >
                  {submittingRsvp ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </button>
              </div>
            )}
          </div>

          {/* Wish Form */}
          <div className="card">
            <h3 className="font-serif text-xl text-stone-800 mb-6">💌 Kirim Ucapan</h3>
            <div className="space-y-4">
              <div>
                <label className="font-sans text-stone-500 text-xs tracking-widest uppercase block mb-1">Nama</label>
                <input
                  type="text"
                  value={wishForm.name}
                  onChange={e => setWishForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Nama Anda"
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold-400 bg-white"
                />
              </div>
              <div>
                <label className="font-sans text-stone-500 text-xs tracking-widest uppercase block mb-1">Ucapan & Doa</label>
                <textarea
                  value={wishForm.message}
                  onChange={e => setWishForm(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tuliskan ucapan dan doa terbaik Anda..."
                  rows={4}
                  className="w-full border border-stone-200 rounded-xl px-4 py-3 font-sans text-sm focus:outline-none focus:border-gold-400 bg-white resize-none"
                />
              </div>
              <button
                onClick={submitWish}
                disabled={submittingWish}
                className="w-full bg-stone-800 text-white py-3 rounded-full font-sans text-sm tracking-widest uppercase hover:bg-stone-700 transition-all disabled:opacity-50"
              >
                {submittingWish ? 'Mengirim...' : 'Kirim Ucapan'}
              </button>
            </div>
          </div>
        </div>

        {/* Wish list */}
        {wishes.length > 0 && (
          <div>
            <p className="font-sans text-stone-400 text-xs tracking-widest uppercase text-center mb-6">
              {wishes.length} Ucapan & Doa
            </p>
            <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
              {wishes.map(w => <WishCard key={w.id} wish={w} />)}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}