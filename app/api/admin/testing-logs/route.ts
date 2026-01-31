import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 503 })
    }
    const { data, error } = await supabase
      .from('testing_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(50)

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (error) {
    console.error('[v0] Error fetching testing logs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch testing logs' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 503 })
    }
    const body = await request.json()

    const { error } = await supabase
      .from('testing_logs')
      .insert({
        type: body.type || 'message_received',
        data: JSON.stringify(body.data || body),
        timestamp: new Date().toISOString()
      })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error creating test log:', error)
    return NextResponse.json(
      { error: 'Failed to create test log' },
      { status: 500 }
    )
  }
}
