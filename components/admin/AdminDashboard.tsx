'use client'

import { useState, useEffect } from 'react'
import { Heart, LogOut, Settings as SettingsIcon, BarChart3, MessageSquare, ShieldAlert, RefreshCw } from 'lucide-react'
import ConfessionManager from './ConfessionManager'
import TestingMode from './TestingMode'
import Statistics from './Statistics'
import SettingsPanel from './Settings'

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'confessions' | 'testing' | 'stats' | 'settings'>('confessions')
  const [loading, setLoading] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    window.location.href = '/admin'
  }

  const handleRefresh = async () => {
    setLoading(true)
    // Refresh data across all components
    window.location.reload()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted to-card">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-primary sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-primary p-2 rounded-lg">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-primary">Confess Your Love</h1>
              <p className="text-xs text-muted-foreground">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50"
              title="Refresh data"
            >
              <RefreshCw className={`w-5 h-5 text-foreground ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-semibold transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 flex gap-1 py-2">
          <button
            onClick={() => setActiveTab('confessions')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'confessions'
                ? 'bg-primary text-white'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            Confessions
          </button>
          <button
            onClick={() => setActiveTab('testing')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'testing'
                ? 'bg-primary text-white'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <RefreshCw className="w-4 h-4" />
            Testing
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'stats'
                ? 'bg-primary text-white'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            Statistics
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors ${
              activeTab === 'settings'
                ? 'bg-primary text-white'
                : 'text-foreground hover:bg-muted'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'confessions' && <ConfessionManager />}
        {activeTab === 'testing' && <TestingMode />}
        {activeTab === 'stats' && <Statistics />}
        {activeTab === 'settings' && <SettingsPanel />}
      </main>
    </div>
  )
}
