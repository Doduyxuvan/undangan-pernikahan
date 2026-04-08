'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { WeddingInfo, Guest } from '@/types'
import toast from 'react-hot-toast'

// ---- Auth Guard ----
function useAdminAuth() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  return { user, loading }
}

// ---- Login Form ----
function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function login() {
    if (!email || !password) return toast.error('Email dan password wajib diisi')
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) toast.error('Login gagal: ' + error.message)
    else toast.success('Login berhasil!')
    setLoading(false)
  }

  async function loginMagicLink() {
    if (!email) return toast.error('Masukkan email dulu')
    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({ email })
    if (error) toast.error(error.message)
    else toast.success('Cek email Anda untuk magic link!')
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-stone-900 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="text-5xl mb-4">💍</div>
          <p className="font-script text-5xl text-gold-400 mb-2">Admin Panel</p>
          <p className="font-sans text-stone-400 text-sm">Kelola undangan pernikahan Anda</p>
        </div>
        <div className="bg-stone-800 rounded-2xl p-8 space-y-4">
          <div>
            <label className="font-sans text-stone-400 text-xs font-semibold tracking-widest uppercase block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="email@example.com"
              className="w-full bg-stone-700 border border-stone-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
          <div>
            <label className="font-sans text-stone-400 text-xs font-semibold tracking-widest uppercase block mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && login()}
              placeholder="••••••••"
              className="w-full bg-stone-700 border border-stone-600 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold-400"
            />
          </div>
          <button
            onClick={login}
            disabled={loading}
            className="w-full bg-gold-500 text-white py-3 rounded-full font-sans text-sm tracking-widest uppercase hover:bg-gold-600 transition-all disabled:opacity-50"
          >
            {loading ? '⏳ Masuk...' : '🔐 Masuk'}
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-stone-600" />
            </div>
            <div className="relative text-center">
              <span className="bg-stone-800 px-3 text-xs text-stone-500">atau</span>
            </div>
          </div>
          <button
            onClick={loginMagicLink}
            disabled={loading}
            className="w-full border border-stone-500 text-stone-300 py-3 rounded-full font-sans text-sm hover:border-gold-400 hover:text-gold-400 transition-all"
          >
            ✉️ Kirim Link Login ke Email
          </button>
          <p className="text-xs text-stone-500 text-center">Link login = masuk tanpa password, cukup klik link yang dikirim ke email Anda</p>
        </div>
      </div>
    </div>
  )
}

// ---- Tabs ----
type Tab = 'info' | 'gallery' | 'kehadiran' | 'tamu'

// ---- Audio Uploader ----
function AudioUploader({ currentUrl, onUploaded }: { currentUrl: string; onUploaded: (url: string) => void }) {
  const [uploading, setUploading] = useState(false)

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.includes('audio')) return toast.error('Harus file audio/MP3')
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const storageKey = `backsound/backsound-${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('wedding-images')
        .upload(storageKey, file, { cacheControl: '3600', upsert: true })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from('wedding-images').getPublicUrl(storageKey)
      onUploaded(urlData.publicUrl)
      toast.success('Musik berhasil diupload!')
    } catch (err: any) {
      toast.error('Upload gagal: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="border-2 border-dashed border-stone-600 rounded-xl p-4 text-center hover:border-gold-500 transition-colors">
        <div className="text-3xl mb-2">🎵</div>
        <p className="text-stone-400 text-xs mb-3">Klik tombol di bawah untuk pilih file MP3</p>
        <input
          type="file"
          accept="audio/mp3,audio/mpeg,audio/*"
          onChange={handleUpload}
          disabled={uploading}
          className="w-full text-sm text-stone-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:bg-gold-500 file:text-white hover:file:bg-gold-600 cursor-pointer disabled:opacity-50"
        />
      </div>
      {uploading && (
        <div className="flex items-center gap-2 text-gold-400 text-sm bg-stone-700 rounded-xl px-4 py-3">
          <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
          Mengupload musik...
        </div>
      )}
      {currentUrl && !uploading && (
        <div className="bg-stone-700 border border-stone-600 rounded-xl p-4 space-y-2">
          <p className="text-green-400 text-xs font-semibold">✅ Musik sudah terpasang</p>
          <audio controls src={currentUrl} className="w-full" />
        </div>
      )}
    </div>
  )
}

// ---- Panduan Box ----
function TipBox({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-blue-950 border border-blue-800 rounded-xl p-4 flex gap-3 text-blue-300 text-xs leading-relaxed">
      <span className="text-lg shrink-0">💡</span>
      <div>{children}</div>
    </div>
  )
}

// ---- Section Header ----
function SectionHeader({ icon, title, desc }: { icon: string; title: string; desc?: string }) {
  return (
    <div className="flex items-center gap-3 pb-3 border-b border-stone-700 mb-5">
      <span className="text-2xl">{icon}</span>
      <div>
        <p className="font-semibold text-white text-sm">{title}</p>
        {desc && <p className="text-stone-400 text-xs mt-0.5">{desc}</p>}
      </div>
    </div>
  )
}

const inputClass = "w-full bg-stone-700 border border-stone-600 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-gold-400 placeholder-stone-500"

// ---- Info Tab ----
type BankAccount = { bank: string; account_number: string; account_name: string }

function InfoTab() {
  const [form, setForm] = useState<Partial<WeddingInfo>>({})
  const [accounts, setAccounts] = useState<BankAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    fetch('/api/wedding-info')
      .then(r => r.json())
      .then(d => {
        if (d && !d.error) { setForm(d); setAccounts(d.bank_accounts || []) }
      })
      .finally(() => setLoading(false))
  }, [])

  async function save() {
    setSaving(true)
    const res = await fetch('/api/wedding-info', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...form, bank_accounts: accounts }),
    })
    if (res.ok) toast.success('✅ Perubahan berhasil disimpan!')
    else toast.error('Gagal menyimpan, coba lagi')
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-20 gap-3 text-stone-400">
      <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
      Memuat data...
    </div>
  )

  const field = (label: string, key: keyof WeddingInfo, type = 'text', hint?: string) => (
    <div key={key}>
      <label className="font-sans text-stone-400 text-xs font-semibold tracking-wide uppercase block mb-1">{label}</label>
      {hint && <p className="text-stone-500 text-xs mb-1.5 leading-relaxed">{hint}</p>}
      <input
        type={type}
        value={(form[key] as string) || ''}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
        className={inputClass}
      />
    </div>
  )

  function updateAccount(index: number, key: keyof BankAccount, value: string) {
    const updated = [...accounts]
    updated[index] = { ...updated[index], [key]: value }
    setAccounts(updated)
  }

  return (
    <div className="space-y-8">

      {/* Mempelai */}
      <div className="bg-stone-800 rounded-2xl p-6">
        <SectionHeader icon="👫" title="Nama Mempelai" desc="Isi nama yang akan tampil di undangan" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-xs font-bold text-gold-400 uppercase tracking-widest">Mempelai Pria</p>
            {field('Nama Panggilan', 'groom_name', 'text', 'Contoh: Budi — nama ini muncul di bagian depan undangan')}
            {field('Nama Lengkap', 'groom_full_name', 'text', 'Nama sesuai KTP, ditampilkan di bagian detail')}
            {field('Nama Orang Tua', 'groom_parents', 'text', 'Contoh: Putra dari Bpk. Ahmad & Ibu Sari')}
          </div>
          <div className="space-y-4">
            <p className="text-xs font-bold text-gold-400 uppercase tracking-widest">Mempelai Wanita</p>
            {field('Nama Panggilan', 'bride_name', 'text', 'Contoh: Siti — nama ini muncul di bagian depan undangan')}
            {field('Nama Lengkap', 'bride_full_name', 'text', 'Nama sesuai KTP, ditampilkan di bagian detail')}
            {field('Nama Orang Tua', 'bride_parents', 'text', 'Contoh: Putri dari Bpk. Hendra & Ibu Dewi')}
          </div>
        </div>
      </div>

      {/* Jadwal */}
      <div className="bg-stone-800 rounded-2xl p-6">
        <SectionHeader icon="📅" title="Tanggal & Tempat Acara" desc="Isi jadwal akad nikah dan resepsi" />
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <p className="text-xs font-bold text-gold-400 uppercase tracking-widest">🕌 Akad Nikah</p>
            {field('Tanggal Akad', 'akad_date', 'date')}
            {field('Jam Mulai', 'akad_time', 'time')}
            {field('Nama Tempat', 'akad_venue', 'text', 'Contoh: Masjid Al-Ikhlas')}
            {field('Alamat Lengkap', 'akad_address')}
          </div>
          <div className="space-y-4">
            <p className="text-xs font-bold text-gold-400 uppercase tracking-widest">🎊 Resepsi</p>
            {field('Tanggal Resepsi', 'reception_date', 'date')}
            {field('Jam Mulai', 'reception_time', 'time')}
            {field('Nama Tempat', 'reception_venue', 'text', 'Contoh: Gedung Serbaguna Mulia')}
            {field('Alamat Lengkap', 'reception_address')}
          </div>
        </div>
      </div>

      {/* Lokasi */}
      <div className="bg-stone-800 rounded-2xl p-6">
        <SectionHeader icon="📍" title="Link Lokasi & Siaran Langsung" desc="Opsional — isi jika ada" />
        <TipBox>
          <strong>Cara dapat link Google Maps:</strong> Buka Google Maps → cari tempat acara → klik tombol "Bagikan" → salin link-nya dan tempel di sini.
        </TipBox>
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          {field('Link Google Maps', 'maps_url', 'text', 'Tempel link dari Google Maps agar tamu bisa klik langsung')}
          {field('Kode Embed Maps', 'maps_embed', 'text', 'Google Maps → Bagikan → Sematkan peta → salin bagian src="..." saja')}
          {field('Link Live Streaming (YouTube dll)', 'live_streaming_url', 'text', 'Kosongkan jika tidak ada siaran langsung')}
        </div>
      </div>

      {/* Musik */}
      <div className="bg-stone-800 rounded-2xl p-6">
        <SectionHeader icon="🎵" title="Musik Latar Undangan" desc="Musik yang otomatis berbunyi saat tamu buka undangan" />
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="font-sans text-stone-400 text-xs font-semibold tracking-wide uppercase block mb-2">Upload File Musik (MP3)</label>
            <AudioUploader
              currentUrl={(form.backsound_url as string) || ''}
              onUploaded={(url) => setForm(f => ({ ...f, backsound_url: url }))}
            />
          </div>
          <div>
            {field('Judul Lagu', 'backsound_title', 'text', 'Opsional — contoh: "A Thousand Years" by Christina Perri')}
          </div>
        </div>
      </div>

      {/* Rekening */}
      <div className="bg-stone-800 rounded-2xl p-6">
        <SectionHeader icon="💳" title="Nomor Rekening (Amplop Digital)" desc="Untuk tamu yang ingin memberi hadiah uang secara online" />
        <TipBox>
          Tamu yang mau memberi hadiah bisa transfer ke rekening yang Anda daftarkan di sini. Boleh dikosongkan jika tidak ingin menampilkan rekening.
        </TipBox>
        <div className="space-y-3 mt-4">
          {accounts.length === 0 && (
            <div className="text-center py-6 text-stone-500">
              <p className="text-3xl mb-2">🏦</p>
              <p className="text-sm">Belum ada rekening — klik tombol di bawah untuk menambahkan</p>
            </div>
          )}
          {accounts.map((acc, i) => (
            <div key={i} className="bg-stone-700 rounded-xl p-4 border border-stone-600">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Rekening {i + 1}</p>
                <button
                  onClick={() => setAccounts(accounts.filter((_, idx) => idx !== i))}
                  className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                >
                  🗑️ Hapus
                </button>
              </div>
              <div className="grid md:grid-cols-3 gap-3">
                <div>
                  <label className="text-stone-400 text-xs block mb-1">Nama Bank</label>
                  <input
                    type="text"
                    placeholder="BCA, BRI, Mandiri..."
                    value={acc.bank}
                    onChange={e => updateAccount(i, 'bank', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-stone-400 text-xs block mb-1">Nomor Rekening</label>
                  <input
                    type="text"
                    placeholder="1234567890"
                    value={acc.account_number}
                    onChange={e => updateAccount(i, 'account_number', e.target.value)}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-stone-400 text-xs block mb-1">Nama Pemilik</label>
                  <input
                    type="text"
                    placeholder="Nama sesuai buku tabungan"
                    value={acc.account_name}
                    onChange={e => updateAccount(i, 'account_name', e.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setAccounts([...accounts, { bank: '', account_number: '', account_name: '' }])}
            className="w-full border-2 border-dashed border-stone-600 text-stone-400 hover:border-gold-500 hover:text-gold-400 rounded-xl py-3 text-sm transition-all"
          >
            + Tambah Rekening
          </button>
        </div>
      </div>

      {/* Simpan */}
      <div className="flex items-center gap-4 pb-8">
        <button
          onClick={save}
          disabled={saving}
          className="bg-gold-500 text-white px-8 py-3.5 rounded-full font-sans text-sm tracking-widest uppercase hover:bg-gold-600 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg"
        >
          {saving ? (
            <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Menyimpan...</>
          ) : (
            <>💾 Simpan Semua Perubahan</>
          )}
        </button>
        <p className="text-stone-500 text-xs">Klik tombol ini setelah selesai mengisi semua data di atas</p>
      </div>
    </div>
  )
}

// ---- Gallery Tab ----
function GalleryTab() {
  const [photos, setPhotos] = useState<any[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [caption, setCaption] = useState('')
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setPhotos(d) })
      .finally(() => setLoading(false))
  }, [])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function uploadPhoto() {
    if (!file) return toast.error('Pilih foto dulu')
    setUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('wedding-images')
        .upload(fileName, file, { cacheControl: '3600', upsert: false })
      if (uploadError) throw uploadError
      const { data: urlData } = supabase.storage.from('wedding-images').getPublicUrl(fileName)
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlData.publicUrl, caption, order: photos.length }),
      })
      const resJson = await res.json()
      if (!res.ok) throw new Error(resJson.error || 'Gagal simpan ke database')
      setPhotos(prev => [...prev, resJson])
      setFile(null); setCaption(''); setPreview(null)
      toast.success('✅ Foto berhasil ditambahkan!')
    } catch (err: any) {
      toast.error('Upload gagal: ' + err.message)
    } finally {
      setUploading(false)
    }
  }

  async function deletePhoto(id: string, url: string) {
    const fileName = url.split('/').pop()
    if (fileName) await supabase.storage.from('wedding-images').remove([fileName])
    await fetch('/api/gallery', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setPhotos(prev => prev.filter(p => p.id !== id))
    toast.success('Foto dihapus')
  }

  return (
    <div className="space-y-6">
      <div className="bg-stone-800 rounded-2xl p-6">
        <SectionHeader icon="📤" title="Tambah Foto ke Galeri" desc="Foto-foto ini akan ditampilkan di halaman undangan" />
        <TipBox>
          Upload foto prewedding atau foto keluarga. Tamu yang membuka undangan bisa melihat semua foto di galeri.
        </TipBox>
        <div className="space-y-4 mt-4">
          <div
            className="border-2 border-dashed border-stone-600 rounded-xl p-6 text-center cursor-pointer hover:border-gold-500 transition-colors"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            {preview ? (
              <div className="w-32 h-32 rounded-xl overflow-hidden mx-auto">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="preview" className="w-full h-full object-cover" />
              </div>
            ) : (
              <>
                <div className="text-4xl mb-2">🖼️</div>
                <p className="text-stone-300 text-sm font-medium">Klik di sini untuk pilih foto</p>
                <p className="text-stone-500 text-xs mt-1">Format JPG, PNG, atau WEBP</p>
              </>
            )}
          </div>
          <input id="file-input" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          <div>
            <label className="text-stone-400 text-xs font-semibold uppercase tracking-wide block mb-1">Keterangan Foto (Opsional)</label>
            <p className="text-stone-500 text-xs mb-1.5">Contoh: "Foto prewedding di Bali"</p>
            <input
              type="text"
              placeholder="Tulis keterangan foto..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className={inputClass}
            />
          </div>
          <button
            onClick={uploadPhoto}
            disabled={uploading || !file}
            className="w-full bg-gold-500 text-white py-3 rounded-full font-sans text-sm hover:bg-gold-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {uploading ? (
              <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Mengupload...</>
            ) : (
              <>📤 Upload Foto Sekarang</>
            )}
          </button>
        </div>
      </div>

      <div className="bg-stone-800 rounded-2xl p-6">
        <SectionHeader icon="🗂️" title={`Foto di Galeri (${photos.length} foto)`} desc="Arahkan kursor ke foto untuk menghapusnya" />
        {loading ? (
          <div className="flex items-center justify-center py-10 gap-3 text-stone-400">
            <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            Memuat foto...
          </div>
        ) : photos.length === 0 ? (
          <div className="text-center py-10 text-stone-500">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">Belum ada foto — upload foto pertama di atas!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {photos.map(p => (
              <div key={p.id} className="relative group rounded-xl overflow-hidden bg-stone-700 aspect-square shadow-sm">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.caption} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() => deletePhoto(p.id, p.url)}
                    className="bg-red-500 text-white px-4 py-2 rounded-full text-xs hover:bg-red-600 shadow"
                  >
                    🗑️ Hapus Foto
                  </button>
                </div>
                {p.caption && (
                  <p className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-2">{p.caption}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Kehadiran Tab ----
function KehadiranTab() {
  const [rsvps, setRsvps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'semua' | 'hadir' | 'tidak_hadir' | 'mungkin'>('semua')

  useEffect(() => {
    fetch('/api/rsvp')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setRsvps(d) })
      .finally(() => setLoading(false))
  }, [])

  const hadir = rsvps.filter(r => r.attendance === 'hadir')
  const tidak = rsvps.filter(r => r.attendance === 'tidak_hadir')
  const mungkin = rsvps.filter(r => r.attendance === 'mungkin')
  const totalOrang = hadir.reduce((sum, r) => sum + (r.guests_count || 1), 0)

  const filtered =
    filter === 'semua' ? rsvps :
    filter === 'hadir' ? hadir :
    filter === 'tidak_hadir' ? tidak :
    mungkin

  return (
    <div className="space-y-6">
      <TipBox>
        Di sini Anda bisa melihat siapa saja tamu yang sudah mengisi konfirmasi kehadiran di halaman undangan. Tamu yang belum mengisi tidak akan muncul di daftar ini.
      </TipBox>

      {/* Ringkasan */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Konfirmasi', count: rsvps.length, icon: '📋', color: 'text-white' },
          { label: 'Akan Hadir', count: hadir.length, icon: '✅', color: 'text-green-400', sub: `~${totalOrang} orang` },
          { label: 'Tidak Bisa Hadir', count: tidak.length, icon: '❌', color: 'text-red-400' },
          { label: 'Belum Pasti', count: mungkin.length, icon: '🤔', color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="bg-stone-800 border border-stone-700 rounded-2xl p-4 text-center">
            <p className="text-2xl mb-1">{s.icon}</p>
            <p className={`font-bold text-3xl ${s.color}`}>{s.count}</p>
            <p className="text-stone-400 text-xs mt-1">{s.label}</p>
            {s.sub && <p className="text-stone-500 text-xs">{s.sub}</p>}
          </div>
        ))}
      </div>

      <div className="bg-stone-800 rounded-2xl p-6">
        <SectionHeader icon="📋" title="Daftar Tamu yang Sudah Konfirmasi" desc="Tamu yang sudah mengisi form di undangan" />

        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-5">
          {[
            { id: 'semua', label: 'Semua' },
            { id: 'hadir', label: '✅ Hadir' },
            { id: 'tidak_hadir', label: '❌ Tidak Hadir' },
            { id: 'mungkin', label: '🤔 Belum Pasti' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id as any)}
              className={`text-xs px-4 py-2 rounded-full border transition-all ${
                filter === f.id
                  ? 'bg-gold-500 text-white border-gold-500'
                  : 'border-stone-600 text-stone-400 hover:border-gold-500'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-3 text-stone-400">
            <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            Memuat data...
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-stone-500">
            <p className="text-4xl mb-2">📭</p>
            <p className="text-sm">Belum ada konfirmasi kehadiran</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(r => (
              <div key={r.id} className="bg-stone-700 rounded-xl p-4 flex items-start justify-between border border-stone-600">
                <div className="flex-1">
                  <p className="font-semibold text-white">{r.guest_name}</p>
                  <p className="text-stone-400 text-xs mt-0.5">
                    📅 {new Date(r.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    {r.guests_count > 1 && <span className="ml-2">👥 {r.guests_count} orang</span>}
                  </p>
                  {r.message && (
                    <p className="text-stone-400 text-xs mt-2 italic bg-stone-800 rounded-lg px-3 py-2 border border-stone-600">
                      💬 "{r.message}"
                    </p>
                  )}
                </div>
                <span className={`text-xs px-3 py-1.5 rounded-full font-semibold ml-3 shrink-0 ${
                  r.attendance === 'hadir' ? 'bg-green-900 text-green-300' :
                  r.attendance === 'tidak_hadir' ? 'bg-red-900 text-red-300' :
                  'bg-yellow-900 text-yellow-300'
                }`}>
                  {r.attendance === 'hadir' ? '✅ Hadir' :
                   r.attendance === 'tidak_hadir' ? '❌ Tidak Hadir' :
                   '🤔 Belum Pasti'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Tamu Tab (Smart Sender) ----
function TamuTab() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  useEffect(() => {
    fetch('/api/guest')
      .then(r => r.json())
      .then(d => { if (Array.isArray(d)) setGuests(d) })
      .finally(() => setLoading(false))
  }, [])

  async function addGuest() {
    if (!name) return toast.error('Nama tamu wajib diisi')
    const res = await fetch('/api/guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, phone }),
    })
    if (res.ok) {
      const g = await res.json()
      setGuests(prev => [g, ...prev])
      setName(''); setPhone('')
      toast.success('✅ Tamu berhasil ditambahkan!')
    }
  }

  async function deleteGuest(id: string) {
    await fetch('/api/guest', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    setGuests(prev => prev.filter(g => g.id !== id))
    toast.success('Tamu dihapus')
  }

  function copyLink(slug: string) {
    navigator.clipboard.writeText(`${baseUrl}/u/${slug}`)
    toast.success('📋 Link berhasil disalin!')
  }

  function whatsappLink(guest: Guest) {
    const link = `${baseUrl}/u/${guest.slug}`
    const text = `Assalamu'alaikum, kami mengundang ${guest.name} untuk hadir di acara pernikahan kami. Buka undangan di sini: ${link}`
    return `https://wa.me/${guest.phone?.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
  }

  const filteredGuests = guests.filter(g =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <TipBox>
        <strong>Cara kerja Kirim Undangan:</strong> Tambahkan nama tamu → setiap tamu otomatis mendapat link undangan unik yang menyapa namanya → klik tombol "Kirim WA" untuk langsung membuka WhatsApp dengan pesan yang sudah disiapkan.
      </TipBox>

      <div className="bg-stone-800 rounded-2xl p-6">
        <SectionHeader icon="➕" title="Tambah Tamu Baru" desc="Masukkan nama dan nomor WhatsApp tamu" />
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="text-stone-400 text-xs font-semibold uppercase tracking-wide block mb-1">Nama Tamu</label>
            <p className="text-stone-500 text-xs mb-1.5">Nama ini yang akan muncul di undangan tamu tersebut</p>
            <input
              type="text"
              placeholder="Contoh: Pak Budi Santoso"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addGuest()}
              className={inputClass}
            />
          </div>
          <div>
            <label className="text-stone-400 text-xs font-semibold uppercase tracking-wide block mb-1">Nomor WhatsApp</label>
            <p className="text-stone-500 text-xs mb-1.5">Opsional — dibutuhkan untuk kirim undangan via WA</p>
            <input
              type="text"
              placeholder="Contoh: 08123456789"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addGuest()}
              className={inputClass}
            />
          </div>
        </div>
        <button
          onClick={addGuest}
          className="mt-4 bg-gold-500 text-white px-6 py-2.5 rounded-full font-sans text-sm hover:bg-gold-600 transition-all flex items-center gap-2"
        >
          ➕ Tambah Tamu
        </button>
      </div>

      <div className="bg-stone-800 rounded-2xl p-6">
        <SectionHeader icon="👥" title={`Daftar Tamu (${guests.length} orang)`} desc="Kirim link undangan personal ke setiap tamu" />
        <div className="mb-4">
          <input
            type="text"
            placeholder="🔍 Cari nama tamu..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className={inputClass}
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-10 gap-3 text-stone-400">
            <div className="w-5 h-5 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
            Memuat daftar tamu...
          </div>
        ) : filteredGuests.length === 0 ? (
          <div className="text-center py-10 text-stone-500">
            <p className="text-4xl mb-2">{search ? '🔍' : '👤'}</p>
            <p className="text-sm">{search ? 'Tamu tidak ditemukan' : 'Belum ada tamu — tambahkan tamu di atas!'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredGuests.map(g => (
              <div key={g.id} className="bg-stone-700 rounded-xl p-4 border border-stone-600">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-white">{g.name}</p>
                    {g.phone && <p className="text-stone-400 text-xs">📱 {g.phone}</p>}
                  </div>
                  <button
                    onClick={() => deleteGuest(g.id)}
                    className="text-red-400 text-xs hover:text-red-300 flex items-center gap-1"
                  >
                    🗑️ Hapus
                  </button>
                </div>
                <div className="flex gap-2 flex-wrap items-center">
                  <button
                    onClick={() => copyLink(g.slug)}
                    className="text-xs px-3 py-1.5 rounded-full border border-stone-500 text-stone-300 hover:border-gold-500 hover:text-gold-400 transition-all flex items-center gap-1"
                  >
                    📋 Salin Link
                  </button>
                  {g.phone && (
                    <a
                      href={whatsappLink(g)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs px-3 py-1.5 rounded-full bg-green-700 text-white hover:bg-green-600 transition-all flex items-center gap-1"
                    >
                      💬 Kirim WA
                    </a>
                  )}
                  <span className="text-stone-600 text-xs truncate max-w-xs">
                    {baseUrl}/u/{g.slug}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ---- Main Admin Dashboard ----
export default function AdminPage() {
  const { user, loading } = useAdminAuth()
  const [tab, setTab] = useState<Tab>('info')

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-gold-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-stone-400 text-sm">Memeriksa sesi login...</p>
        </div>
      </div>
    )
  }

  if (!user) return <LoginForm />

  const tabs: { id: Tab; label: string; icon: string; desc: string }[] = [
    { id: 'info',      label: 'Info Undangan',    icon: '💍', desc: 'Isi nama pengantin, tanggal & tempat acara' },
    { id: 'gallery',   label: 'Foto & Galeri',    icon: '📸', desc: 'Upload foto prewedding dan foto acara' },
    { id: 'kehadiran', label: 'Konfirmasi Hadir', icon: '✅', desc: 'Lihat siapa yang sudah konfirmasi kehadiran' },
    { id: 'tamu',      label: 'Kirim Undangan',   icon: '💬', desc: 'Tambah tamu dan kirim link undangan via WhatsApp' },
  ]

  return (
    <div className="min-h-screen bg-stone-900 text-white">
      {/* Header */}
      <header className="bg-stone-900 border-b border-stone-700 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="font-script text-3xl text-gold-400">Admin Panel</p>
            <p className="font-sans text-stone-400 text-xs mt-0.5">Kelola undangan pernikahan Anda</p>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/"
              target="_blank"
              className="text-stone-400 text-xs hover:text-gold-400 transition-colors flex items-center gap-1"
            >
              👁️ Lihat Undangan
            </a>
            <button
              onClick={() => supabase.auth.signOut()}
              className="text-stone-400 text-xs hover:text-red-400 transition-colors flex items-center gap-1"
            >
              🚪 Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Tab Navigation — FIX: sembunyikan scrollbar horizontal */}
      <div className="bg-stone-800 border-b border-stone-700">
        <div className="max-w-5xl mx-auto px-4">
          <div
            className="flex gap-1 overflow-x-auto pb-px"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            <style>{`.tab-scroll::-webkit-scrollbar { display: none; }`}</style>
            {tabs.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex flex-col items-start px-5 py-3.5 font-sans text-sm whitespace-nowrap border-b-2 transition-all ${
                  tab === t.id
                    ? 'border-gold-400 text-gold-400'
                    : 'border-transparent text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="flex items-center gap-2 font-medium">
                  <span>{t.icon}</span>
                  {t.label}
                </span>
                <span className="text-xs text-stone-500 mt-0.5 font-normal hidden md:block">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {tab === 'info'      && <InfoTab />}
        {tab === 'gallery'   && <GalleryTab />}
        {tab === 'kehadiran' && <KehadiranTab />}
        {tab === 'tamu'      && <TamuTab />}
      </main>
    </div>
  )
}