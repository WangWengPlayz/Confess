'use client'

import { useState, useEffect } from 'react'
import { Heart, MessageSquare, CheckCircle, XCircle } from 'lucide-react'

interface Stats {
  totalConfessions: number
  approvedConfessions: number
  rejectedConfessions: number
  pendingConfessions: number
  totalMessages: number
}

export default function Statistics() {
  const [stats, setStats] = useState<Stats>({
    totalConfessions: 0,
    approvedConfessions: 0,
    rejectedConfessions: 0,
    pendingConfessions: 0,
    totalMessages: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStatistics()
  }, [])

  const fetchStatistics = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/statistics')
      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('[v0] Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }

  const approvalRate = stats.totalConfessions > 0
    ? ((stats.approvedConfessions / stats.totalConfessions) * 100).toFixed(1)
    : '0'

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
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
        <Heart className="w-6 h-6 text-primary" />
        Statistics & Analytics
      </h2>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Confessions */}
        <div className="bg-card border-2 border-primary rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Confessions</p>
              <p className="text-3xl font-bold text-primary">{stats.totalConfessions}</p>
            </div>
            <Heart className="w-10 h-10 text-primary/20 fill-primary/20" />
          </div>
        </div>

        {/* Approved */}
        <div className="bg-card border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Approved</p>
              <p className="text-3xl font-bold text-green-600">{stats.approvedConfessions}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-green-500/20 fill-green-500/20" />
          </div>
        </div>

        {/* Rejected */}
        <div className="bg-card border-2 border-red-500 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Rejected</p>
              <p className="text-3xl font-bold text-red-600">{stats.rejectedConfessions}</p>
            </div>
            <XCircle className="w-10 h-10 text-red-500/20 fill-red-500/20" />
          </div>
        </div>

        {/* Pending */}
        <div className="bg-card border-2 border-yellow-500 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.pendingConfessions}</p>
            </div>
            <MessageSquare className="w-10 h-10 text-yellow-500/20 fill-yellow-500/20" />
          </div>
        </div>

        {/* Approval Rate */}
        <div className="bg-card border-2 border-purple-500 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Approval Rate</p>
              <p className="text-3xl font-bold text-purple-600">{approvalRate}%</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
              <span className="text-sm font-bold text-purple-600">%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Breakdown */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-6">Status Breakdown</h3>
          <div className="space-y-4">
            {/* Approved */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Approved</span>
                <span className="text-sm font-semibold text-foreground">{stats.approvedConfessions}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-green-500 h-full transition-all"
                  style={{
                    width: `${stats.totalConfessions > 0 ? (stats.approvedConfessions / stats.totalConfessions) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Pending */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Pending</span>
                <span className="text-sm font-semibold text-foreground">{stats.pendingConfessions}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-yellow-500 h-full transition-all"
                  style={{
                    width: `${stats.totalConfessions > 0 ? (stats.pendingConfessions / stats.totalConfessions) * 100 : 0}%`
                  }}
                />
              </div>
            </div>

            {/* Rejected */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground">Rejected</span>
                <span className="text-sm font-semibold text-foreground">{stats.rejectedConfessions}</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <div
                  className="bg-red-500 h-full transition-all"
                  style={{
                    width: `${stats.totalConfessions > 0 ? (stats.rejectedConfessions / stats.totalConfessions) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quick Info */}
        <div className="bg-card border border-border rounded-lg p-6">
          <h3 className="font-semibold text-foreground mb-6">Quick Info</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Total Messages Processed</span>
              <span className="font-bold text-foreground">{stats.totalMessages}</span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">Average Confessions/Day</span>
              <span className="font-bold text-foreground">
                {stats.totalConfessions > 0 ? (stats.totalConfessions / 7).toFixed(1) : '0'}
              </span>
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-sm text-muted-foreground">Pending Review</span>
              <span className="font-bold text-yellow-600">{stats.pendingConfessions}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
