import { NextRequest, NextResponse } from 'next/server'
import { getSupabaseClient } from '@/lib/supabase'

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = getSupabaseClient()
    const { id } = params
    const { status } = await request.json()

    const { error } = await supabase
      .from('confessions')
      .update({ status })
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('[v0] Error updating confession:', error)
    return NextResponse.json(
      { error: 'Failed to update confession' },
      { status: 500 }
    )
  }
}
