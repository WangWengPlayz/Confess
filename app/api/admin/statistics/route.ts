import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabaseClient()
    if (!supabase) {
      return NextResponse.json({ 
        totalConfessions: 0,
        approvedConfessions: 0,
        rejectedConfessions: 0,
        pendingConfessions: 0,
        totalMessages: 0,
        error: 'Supabase client not initialized'
      }, { status: 503 })
    }
    const { data: confessions, error: confError } = await supabase
      .from('confessions')
      .select('status')

    if (confError) throw confError

    const totalConfessions = confessions?.length || 0
    const approvedConfessions = confessions?.filter((c: any) => c.status === 'approved').length || 0
    const rejectedConfessions = confessions?.filter((c: any) => c.status === 'rejected').length || 0
    const pendingConfessions = confessions?.filter((c: any) => c.status === 'pending').length || 0

    // Get testing logs count as proxy for total messages
    const { data: testLogs, error: logError } = await supabase
      .from('testing_logs')
      .select('id')

    if (logError) throw logError

    return NextResponse.json({
      totalConfessions,
      approvedConfessions,
      rejectedConfessions,
      pendingConfessions,
      totalMessages: testLogs?.length || 0
    })
  } catch (error) {
    console.error('[v0] Error fetching statistics:', error)
    return NextResponse.json(
      { 
        totalConfessions: 0,
        approvedConfessions: 0,
        rejectedConfessions: 0,
        pendingConfessions: 0,
        totalMessages: 0
      },
      { status: 500 }
    )
  }
}
