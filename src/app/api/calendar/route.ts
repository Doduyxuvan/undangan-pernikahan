import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

function formatDate(dateStr: string, timeStr: string) {
  const date = dateStr.replace(/-/g, '')
  const time = (timeStr || '00:00').replace(':', '') + '00'
  return `${date}T${time}`
}

function addHours(dateStr: string, timeStr: string, hours: number) {
  const date = dateStr.replace(/-/g, '')
  const [h, m] = (timeStr || '00:00').split(':').map(Number)
  const newH = Math.min(h + hours, 23)
  return `${date}T${String(newH).padStart(2, '0')}${String(m).padStart(2, '0')}00`
}

export async function GET() {
  const supabase = getSupabase()
  const { data: info, error } = await supabase
    .from('wedding_info')
    .select('*')
    .single()

  if (error || !info) {
    return NextResponse.json({ error: 'Wedding info not found' }, { status: 404 })
  }

  const title = `Pernikahan ${info.groom_name} & ${info.bride_name}`
  const akadStart = formatDate(info.akad_date, info.akad_time)
  const akadEnd = addHours(info.akad_date, info.akad_time, 2)
  const receptionStart = formatDate(info.reception_date, info.reception_time)
  const receptionEnd = addHours(info.reception_date, info.reception_time, 3)

  // Google Calendar URL for reception
  const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${receptionStart}/${receptionEnd}&location=${encodeURIComponent(info.reception_address || '')}&details=${encodeURIComponent(`Akad Nikah: ${info.akad_venue} pukul ${info.akad_time}\nResepsi: ${info.reception_venue} pukul ${info.reception_time}`)}`

  // iCal format
  const ical = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//ID',
    'BEGIN:VEVENT',
    `DTSTART:${akadStart}`,
    `DTEND:${akadEnd}`,
    `SUMMARY:Akad Nikah - ${title}`,
    `LOCATION:${info.akad_venue || ''}, ${info.akad_address || ''}`,
    `DESCRIPTION:Akad Nikah ${title}`,
    'END:VEVENT',
    'BEGIN:VEVENT',
    `DTSTART:${receptionStart}`,
    `DTEND:${receptionEnd}`,
    `SUMMARY:Resepsi - ${title}`,
    `LOCATION:${info.reception_venue || ''}, ${info.reception_address || ''}`,
    `DESCRIPTION:Resepsi Pernikahan ${title}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n')

  return NextResponse.json({
    google_calendar_url: googleCalendarUrl,
    ical_content: ical,
    events: {
      akad: {
        title: `Akad Nikah - ${title}`,
        start: akadStart,
        end: akadEnd,
        venue: info.akad_venue,
        address: info.akad_address,
      },
      reception: {
        title: `Resepsi - ${title}`,
        start: receptionStart,
        end: receptionEnd,
        venue: info.reception_venue,
        address: info.reception_address,
      },
    },
  })
}
