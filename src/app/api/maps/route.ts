import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function GET() {
  const supabase = getSupabase()
  const { data: info, error } = await supabase
    .from('wedding_info')
    .select('maps_url, maps_embed, reception_venue, reception_address, akad_venue, akad_address')
    .single()

  if (error || !info) {
    return NextResponse.json({ error: 'Wedding info not found' }, { status: 404 })
  }

  // Auto-generate Google Maps search URL if maps_url not set
  const mapsUrl = info.maps_url ||
    `https://www.google.com/maps/search/${encodeURIComponent(info.reception_venue + ' ' + info.reception_address)}`

  return NextResponse.json({
    maps_url: mapsUrl,
    maps_embed: info.maps_embed || null,
    reception_venue: info.reception_venue,
    reception_address: info.reception_address,
    akad_venue: info.akad_venue,
    akad_address: info.akad_address,
  })
}
