'use client'

import { motion } from 'framer-motion'
import type { WeddingInfo } from '@/types'

function CalendarLink({ info }: { info: WeddingInfo }) {
  const title = encodeURIComponent(`Pernikahan ${info.groom_name} & ${info.bride_name}`)
  const loc = encodeURIComponent(info.reception_address)
  const dateStr = info.reception_date.replace(/-/g, '')
  const timeStr = (info.reception_time || '00:00').replace(':', '') + '00'
  const start = `${dateStr}T${timeStr}`
  const startHour = parseInt((info.reception_time || '00:00').split(':')[0])
  const endHour = String(Math.min(startHour + 3, 23)).padStart(2, '0')
  const endMin = (info.reception_time || '00:00').split(':')[1] || '00'
  const end = `${dateStr}T${endHour}${endMin}00`
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&location=${loc}&details=${encodeURIComponent(`Pernikahan ${info.groom_name} & ${info.bride_name}`)}`

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 border border-gold-400 text-gold-600 px-5 py-2.5 rounded-full text-sm font-sans hover:bg-gold-50 transition-all mt-4"
    >
      📅 Simpan ke Google Calendar
    </a>
  )
}

function EventCard({
  title, date, time, venue, address, icon, delay,
}: {
  title: string
  date: string
  time: string
  venue: string
  address: string
  icon: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay }}
      className="card text-center"
    >
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="font-script text-4xl text-gold-600 mb-4">{title}</h3>
      <div className="w-12 h-px bg-gold-300 mx-auto mb-4" />
      <p className="font-serif text-stone-700 text-lg mb-1">
        {new Date(date + 'T00:00:00').toLocaleDateString('id-ID', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}
      </p>
      <p className="font-sans text-gold-600 font-medium mb-4">Pukul {time} WIB</p>
      <p className="font-serif text-stone-800 text-lg font-medium">{venue}</p>
      <p className="font-sans text-stone-500 text-sm mt-1">{address}</p>
    </motion.div>
  )
}

export default function EventSection({ info }: { info: WeddingInfo }) {
  return (
    <section className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <p className="section-title">Acara Pernikahan</p>
          <p className="section-subtitle">Dengan penuh sukacita kami mengundang kehadiran Anda</p>
        </motion.div>

        {/* Event Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <EventCard
            title="Akad Nikah"
            date={info.akad_date}
            time={info.akad_time}
            venue={info.akad_venue}
            address={info.akad_address}
            icon="🕌"
            delay={0.1}
          />
          <EventCard
            title="Resepsi"
            date={info.reception_date}
            time={info.reception_time}
            venue={info.reception_venue}
            address={info.reception_address}
            icon="🎊"
            delay={0.2}
          />
        </div>

        {/* Maps & Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-center space-y-4"
        >
          {info.maps_embed && (
            <div className="rounded-2xl overflow-hidden shadow-md h-64 mb-6">
              <iframe
                src={info.maps_embed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          )}
          <div className="flex flex-wrap gap-3 justify-center">
            {info.maps_url && (
              <a
                href={info.maps_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gold-500 text-white px-5 py-2.5 rounded-full text-sm font-sans hover:bg-gold-600 transition-all shadow-md"
              >
                📍 Buka di Google Maps
              </a>
            )}
            <CalendarLink info={info} />
          </div>
        </motion.div>

      </div>
    </section>
  )
}