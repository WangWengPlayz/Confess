import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 503 })
    }
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'approved'

    let query = supabase
      .from('confessions')
      .select('id, author_name, message, created_at, status')
      .order('created_at', { ascending: false })

    if (status === 'approved') {
      query = query.eq('status', 'approved')
    }

    const { data, error } = await query

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

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ error: 'Supabase client not initialized' }, { status: 503 })
    }
    const body = await request.json()
    const { message, author_name, language } = body

    if (!message || message.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    if (message.length > 500) {
      return NextResponse.json(
        { error: 'Message must be 500 characters or less' },
        { status: 400 }
      )
    }

    // Insert confession
    const { data, error } = await supabase
      .from('confessions')
      .insert({
        author_name: author_name && author_name.trim() ? author_name.trim() : null,
        message: message.trim(),
        status: 'pending',
        language: language || 'en'
      })
      .select()

    if (error) throw error

    return NextResponse.json(
      {
        success: true,
        message: 'Confession submitted successfully',
        confession: data?.[0]
      },
      { status: 201 }
    )
  } catch (error) {
    console.error('[v0] Error creating confession:', error)
    return NextResponse.json(
      { error: 'Failed to create confession' },
      { status: 500 }
    )
  }
}
