import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 503 })
    }
    const { data, error } = await supabase
      .from('confessions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('[v0] Error fetching confessions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch confessions' },
      { status: 500 }
    )
  }
}
