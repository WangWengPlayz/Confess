'use client'

import { useState, useEffect } from 'react'
import { Heart, Check, X, Eye, EyeOff, AlertTriangle } from 'lucide-react'

interface Confession {
  id: string
  author_name: string | null
  message: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  language: string
}

export default function ConfessionManager() {
  const [confessions, setConfessions] = useState<Confession[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [selectedConfession, setSelectedConfession] = useState<Confession | null>(null)

  useEffect(() => {
    fetchConfessions()
  }, [])

  const fetchConfessions = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/confessions')
      const data = await response.json()
      setConfessions(data)
    } catch (error) {
      console.error('[v0] Error fetching confessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/confessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'approved' })
      })

      if (response.ok) {
        setConfessions(confessions.map(c => 
          c.id === id ? { ...c, status: 'approved' } : c
        ))
        setSelectedConfession(null)
      }
    } catch (error) {
      console.error('[v0] Error approving confession:', error)
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/confessions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'rejected' })
      })

      if (response.ok) {
        setConfessions(confessions.map(c => 
          c.id === id ? { ...c, status: 'rejected' } : c
        ))
        setSelectedConfession(null)
      }
    } catch (error) {
      console.error('[v0] Error rejecting confession:', error)
    }
  }

  const filteredConfessions = confessions.filter(c => 
    filter === 'all' ? true : c.status === filter
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Heart className="w-6 h-6 text-primary" />
          Confession Management
        </h2>
        <p className="text-sm text-muted-foreground">
          Total: <span className="font-bold text-foreground">{confessions.length}</span>
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        {(['all', 'pending', 'approved', 'rejected'] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 rounded-lg font-semibold transition-colors capitalize ${
              filter === status
                ? 'bg-primary text-white'
                : 'bg-card border border-border text-foreground hover:bg-muted'
            }`}
          >
            {status} ({filteredConfessions.filter(c => filter === 'all' ? true : c.status === status).length})
          </button>
        ))}
      </div>

      {/* Confessions List */}
      <div className="grid gap-4">
        {filteredConfessions.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No confessions found
          </div>
        ) : (
          filteredConfessions.map(confession => (
            <div
              key={confession.id}
              className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedConfession(confession)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(confession.status)}`}>
                      {confession.status}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(confession.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-foreground font-semibold">
                    {confession.author_name || 'Anonymous'}
                  </p>
                  <p className="text-foreground mt-2 line-clamp-2">
                    {confession.message}
                  </p>
                </div>
                <Heart className="w-5 h-5 text-primary ml-4 flex-shrink-0" />
              </div>

              {confession.status === 'pending' && (
                <div className="flex gap-2 mt-4 pt-4 border-t border-border">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleApprove(confession.id)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleReject(confession.id)
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Modal for detailed view */}
      {selectedConfession && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg p-6 max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-foreground">
                {selectedConfession.author_name || 'Anonymous Confession'}
              </h3>
              <button
                onClick={() => setSelectedConfession(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedConfession.status)}`}>
                  {selectedConfession.status}
                </span>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <p className="text-foreground bg-background p-4 rounded-lg whitespace-pre-wrap">
                  {selectedConfession.message}
                </p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Language</p>
                <p className="text-foreground">{selectedConfession.language || 'English'}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Date</p>
                <p className="text-foreground">
                  {new Date(selectedConfession.created_at).toLocaleString()}
                </p>
              </div>

              {selectedConfession.status === 'pending' && (
                <div className="flex gap-2 pt-4 border-t border-border">
                  <button
                    onClick={() => handleApprove(selectedConfession.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    <Check className="w-4 h-4" />
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(selectedConfession.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
