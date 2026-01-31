import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from('admin_settings')
      .select('*')
      .single()

    if (error && error.code !== 'PGRST116') throw error

    return NextResponse.json(data || {
      facebookPageId: null,
      facebookAccessToken: null,
      facebookPageName: null,
      facebookPageLogo: null,
      moderationEnabled: true
    })
  } catch (error) {
    console.error('[v0] Error fetching settings:', error)
    return NextResponse.json(
      {
        facebookPageId: null,
        facebookAccessToken: null,
        facebookPageName: null,
        facebookPageLogo: null,
        moderationEnabled: true
      },
      { status: 200 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()

    // Check if settings already exist
    const { data: existing } = await supabase
      .from('admin_settings')
      .select('id')
      .single()

    if (existing) {
      const { error } = await supabase
        .from('admin_settings')
        .update(body)
        .eq('id', existing.id)

      if (error) throw error
    } else {
      const { error } = await supabase
        .from('admin_settings')
        .insert(body)

      if (error) throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error saving settings:', error)
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    )
  }
}
