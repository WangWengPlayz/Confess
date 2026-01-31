import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const { message } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    // Log the test message
    const { error: logError } = await supabase
      .from('testing_logs')
      .insert({
        type: 'message_received',
        data: message,
        timestamp: new Date().toISOString()
      })

    if (logError) throw logError

    // Create a test confession
    const { error: confError } = await supabase
      .from('confessions')
      .insert({
        author_name: 'Test User',
        message: message,
        status: 'pending',
        language: 'en'
      })

    if (confError) throw confError

    return NextResponse.json({
      success: true,
      message: 'Test message created'
    })
  } catch (error) {
    console.error('[v0] Error creating test message:', error)
    return NextResponse.json(
      { error: 'Failed to create test message' },
      { status: 500 }
    )
  }
}
