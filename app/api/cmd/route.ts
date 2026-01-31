import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

const VERIFY_TOKEN = process.env.WEBHOOK_VERIFY_TOKEN || 'confess_your_love_webhook_token'

// Handle webhook verification from Facebook
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const mode = searchParams.get('hub.mode')
    const token = searchParams.get('hub.verify_token')
    const challenge = searchParams.get('hub.challenge')

    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      return new NextResponse(challenge, { status: 200 })
    }

    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 403 }
    )
  } catch (error) {
    console.error('[v0] Webhook verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Handle incoming messages from Facebook
export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseClient()
    const body = await request.json()

    // Log incoming message
    await supabase
      .from('testing_logs')
      .insert({
        type: 'message_received',
        data: JSON.stringify(body),
        timestamp: new Date().toISOString()
      })

    // Extract message from Facebook's webhook format
    if (body.object === 'page' && body.entry) {
      for (const entry of body.entry) {
        if (entry.messaging) {
          for (const message of entry.messaging) {
            if (message.message && message.message.text) {
              const text = message.message.text
              const senderId = message.sender?.id

              // Create confession
              const { error } = await supabase
                .from('confessions')
                .insert({
                  author_name: null, // Anonymous by default
                  message: text,
                  status: 'pending',
                  language: 'en'
                })

              if (error) {
                console.error('[v0] Error creating confession:', error)
              } else {
                // Log successful creation
                await supabase
                  .from('testing_logs')
                  .insert({
                    type: 'confession_created',
                    data: `Confession created from sender ${senderId}`,
                    timestamp: new Date().toISOString()
                  })
              }
            }
          }
        }
      }
    }

    return NextResponse.json({ status: 'ok' })
  } catch (error) {
    console.error('[v0] Webhook error:', error)
    
    // Log error
    try {
      const supabase = getSupabaseClient()
      await supabase
        .from('testing_logs')
        .insert({
          type: 'error',
          data: String(error),
          timestamp: new Date().toISOString()
        })
    } catch {}

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
