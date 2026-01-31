'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageCircle } from 'lucide-react'

interface Confession {
  id: string
  author_name: string | null
  message: string
  status: string
  created_at: string
}

export default function ConfessionWall() {
  const [confessions, setConfessions] = useState<Confession[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'approved' | 'all'>('approved')

  useEffect(() => {
    fetchConfessions()
    const interval = setInterval(fetchConfessions, 10000) // Refresh every 10s
    return () => clearInterval(interval)
  }, [filter])

  const fetchConfessions = async () => {
    try {
      const response = await fetch(`/api/confessions?status=${filter}`)
      const data = await response.json()
      setConfessions(data)
    } catch (error) {
      console.error('[v0] Error fetching confessions:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground flex items-center justify-center gap-2 mb-2">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          Confession Wall
          <Heart className="w-8 h-8 text-primary fill-primary" />
        </h2>
        <p className="text-muted-foreground">
          {confessions.length} {confessions.length === 1 ? 'confession' : 'confessions'} from the heart
        </p>
      </div>

      {/* Confessions Grid */}
      {confessions.length === 0 ? (
        <div className="text-center py-16 bg-card border-2 border-dashed border-border rounded-lg">
          <Heart className="w-12 h-12 text-muted mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No confessions yet. Be the first to share your feelings!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {confessions.map((confession) => (
            <div
              key={confession.id}
              className="group bg-white border-2 border-border rounded-lg p-5 hover:border-primary hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {confession.author_name || '💕 Anonymous'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(confession.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Heart className="w-5 h-5 text-primary fill-primary flex-shrink-0 group-hover:scale-110 transition-transform" />
              </div>

              {/* Message */}
              <p className="text-foreground leading-relaxed mb-4 line-clamp-4">
                {confession.message}
              </p>

              {/* Footer */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>Valentine&apos;s Confession</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading More */}
      <div className="text-center pt-8">
        <p className="text-sm text-muted-foreground">
          Refreshing... Last updated {new Date().toLocaleTimeString()}
        </p>
      </div>
    </div>
  )
}
