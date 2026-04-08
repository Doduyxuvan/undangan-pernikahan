import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

function getSupabase() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

// GET: daftar semua tamu (admin)
export async function GET() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from('guests')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// POST: tambah tamu baru
export async function POST(req: NextRequest) {
  const body = await req.json()
  const supabase = getSupabase()

  // Buat slug dari nama
  const slug = body.name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

  const { data, error } = await supabase
    .from('guests')
    .insert({
      name: body.name,
      slug,
      phone: body.phone || '',
      notes: body.notes || '',
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// DELETE: hapus tamu
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const supabase = getSupabase()

  const { error } = await supabase.from('guests').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}