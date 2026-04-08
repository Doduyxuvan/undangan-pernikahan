import { createClient } from '@supabase/supabase-js'
import { redirect } from 'next/navigation'

interface Props {
  params: Promise<{ slug: string }>
}

export default async function GuestPage({ params }: Props) {
  const { slug } = await params

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey || supabaseUrl === 'https://your-project.supabase.co') {
    // Fallback: redirect ke halaman utama dengan nama tamu dari slug
    const guestName = slug.replace(/-/g, ' ')
    redirect(`/?tamu=${encodeURIComponent(guestName)}`)
  }

  const supabase = createClient(supabaseUrl, supabaseKey)
  const { data: guest } = await supabase
    .from('guests')
    .select('name')
    .eq('slug', slug)
    .single()

  if (!guest) {
    // Fallback graceful: gunakan slug sebagai nama
    const guestName = slug.replace(/-/g, ' ')
    redirect(`/?tamu=${encodeURIComponent(guestName)}`)
  }

  redirect(`/?tamu=${encodeURIComponent(guest.name)}`)
}
