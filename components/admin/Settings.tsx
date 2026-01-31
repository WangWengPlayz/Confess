'use client'

import { useState, useEffect } from 'react'
import { Settings as SettingsIcon, Save, Copy, Check } from 'lucide-react'

interface AdminSettings {
  facebookPageId: string | null
  facebookAccessToken: string | null
  facebookPageName: string | null
  facebookPageLogo: string | null
  moderationEnabled: boolean
}

export default function Settings() {
  const [settings, setSettings] = useState<AdminSettings>({
    facebookPageId: '',
    facebookAccessToken: '',
    facebookPageName: '',
    facebookPageLogo: '',
    moderationEnabled: true
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/settings')
      const data = await response.json()
      setSettings(data)
    } catch (error) {
      console.error('[v0] Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('[v0] Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
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
          <SettingsIcon className="w-6 h-6 text-primary" />
          Settings & Configuration
        </h2>
      </div>

      {/* Facebook Integration */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-6">Facebook Page Integration</h3>
        <div className="space-y-4">
          {/* Page ID */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Facebook Page ID
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={settings.facebookPageId || ''}
                onChange={(e) => setSettings({ ...settings, facebookPageId: e.target.value })}
                placeholder="Enter your Facebook Page ID"
                className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
              />
              {settings.facebookPageId && (
                <button
                  onClick={() => copyToClipboard(settings.facebookPageId!, 'pageId')}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  {copied === 'pageId' ? (
                    <Check className="w-5 h-5 text-green-600" />
                  ) : (
                    <Copy className="w-5 h-5 text-foreground" />
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Access Token */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Facebook Access Token
            </label>
            <input
              type="password"
              value={settings.facebookAccessToken || ''}
              onChange={(e) => setSettings({ ...settings, facebookAccessToken: e.target.value })}
              placeholder="Enter your Facebook Access Token"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
            />
            <p className="text-xs text-muted-foreground mt-2">
              Keep this token secure. Never share it publicly.
            </p>
          </div>

          {/* Page Name */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Page Name
            </label>
            <input
              type="text"
              value={settings.facebookPageName || ''}
              onChange={(e) => setSettings({ ...settings, facebookPageName: e.target.value })}
              placeholder="Your Facebook Page Name"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
            />
          </div>

          {/* Page Logo */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Page Logo URL
            </label>
            <input
              type="url"
              value={settings.facebookPageLogo || ''}
              onChange={(e) => setSettings({ ...settings, facebookPageLogo: e.target.value })}
              placeholder="https://example.com/logo.png"
              className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
            />
            {settings.facebookPageLogo && (
              <div className="mt-2">
                <img
                  src={settings.facebookPageLogo || "/placeholder.svg"}
                  alt="Page logo"
                  className="w-16 h-16 rounded object-cover"
                  onError={() => console.log('[v0] Logo image failed to load')}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Moderation Settings */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-6">Moderation</h3>
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.moderationEnabled}
              onChange={(e) => setSettings({ ...settings, moderationEnabled: e.target.checked })}
              className="w-4 h-4 rounded border-border"
            />
            <span className="text-sm text-foreground">
              Enable content moderation (flagged words will be automatically rejected)
            </span>
          </label>
        </div>
      </div>

      {/* Webhook Info */}
      <div className="bg-accent/50 border border-accent rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Webhook Configuration</h3>
        <div className="space-y-3">
          <div>
            <p className="text-sm text-muted-foreground mb-2">Webhook Endpoint</p>
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-background p-3 rounded font-mono text-xs text-foreground border border-border">
                /api/cmd
              </div>
              <button
                onClick={() => copyToClipboard('/api/cmd', 'webhook')}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                {copied === 'webhook' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>

          <div>
            <p className="text-sm text-muted-foreground mb-2">Verify Token</p>
            <div className="flex gap-2 items-center">
              <div className="flex-1 bg-background p-3 rounded font-mono text-xs text-foreground border border-border">
                confess_your_love_webhook_token
              </div>
              <button
                onClick={() => copyToClipboard('confess_your_love_webhook_token', 'token')}
                className="p-2 hover:bg-background rounded-lg transition-colors"
              >
                {copied === 'token' ? (
                  <Check className="w-5 h-5 text-green-600" />
                ) : (
                  <Copy className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-2 justify-end">
        {saved && (
          <div className="px-4 py-2 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-semibold flex items-center gap-2">
            <Check className="w-4 h-4" />
            Settings saved successfully
          </div>
        )}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  )
}
