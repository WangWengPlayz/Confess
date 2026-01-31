'use client'

import { useState, useEffect } from 'react'
import { RefreshCw, Send, Copy, Check } from 'lucide-react'

interface TestLog {
  id: string
  type: 'message_received' | 'message_sent' | 'confession_created' | 'error'
  data: string
  timestamp: string
}

export default function TestingMode() {
  const [logs, setLogs] = useState<TestLog[]>([])
  const [loading, setLoading] = useState(false)
  const [testMessage, setTestMessage] = useState('')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    fetchLogs()
    const interval = autoRefresh ? setInterval(fetchLogs, 3000) : undefined
    return () => clearInterval(interval)
  }, [autoRefresh])

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/admin/testing-logs')
      const data = await response.json()
      if (Array.isArray(data)) {
        setLogs(data)
      } else {
        console.error('[v0] API did not return an array:', data)
        setLogs([])
      }
    } catch (error) {
      console.error('[v0] Error fetching testing logs:', error)
    }
  }

  const handleSendTest = async () => {
    if (!testMessage.trim()) return

    setLoading(true)
    try {
      const response = await fetch('/api/admin/test-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: testMessage })
      })

      if (response.ok) {
        setTestMessage('')
        await fetchLogs()
      }
    } catch (error) {
      console.error('[v0] Error sending test message:', error)
    } finally {
      setLoading(false)
    }
  }

  const getLogColor = (type: string) => {
    switch (type) {
      case 'message_received':
        return 'bg-blue-50 border-blue-200 text-blue-900'
      case 'message_sent':
        return 'bg-green-50 border-green-200 text-green-900'
      case 'confession_created':
        return 'bg-purple-50 border-purple-200 text-purple-900'
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900'
      default:
        return 'bg-gray-50 border-gray-200 text-gray-900'
    }
  }

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopied(id)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-foreground">Testing Mode</h2>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoRefresh}
            onChange={(e) => setAutoRefresh(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm text-foreground">Auto-refresh (3s)</span>
        </label>
      </div>

      {/* Test Message Input */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Send Test Message</h3>
        <div className="flex gap-2">
          <textarea
            value={testMessage}
            onChange={(e) => setTestMessage(e.target.value)}
            placeholder="Enter test message..."
            rows={3}
            className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground resize-none"
          />
          <button
            onClick={handleSendTest}
            disabled={loading || !testMessage.trim()}
            className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 h-fit"
          >
            <Send className="w-4 h-4" />
            Send
          </button>
        </div>
      </div>

      {/* Test Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Webhook URL</p>
          <div className="bg-background p-2 rounded text-xs font-mono text-foreground break-all">
            /api/cmd
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Method</p>
          <div className="bg-background p-2 rounded text-xs font-mono text-foreground">
            POST
          </div>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <p className="text-sm text-muted-foreground mb-2">Status</p>
          <div className="bg-green-50 px-3 py-1 rounded text-xs font-semibold text-green-900">
            ✓ Ready
          </div>
        </div>
      </div>

      {/* Logs */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">Live Logs</h3>
          <button
            onClick={fetchLogs}
            className="p-2 hover:bg-muted rounded-lg transition-colors"
          >
            <RefreshCw className="w-5 h-5 text-foreground" />
          </button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No logs yet</p>
          ) : (
            logs.map(log => (
              <div
                key={log.id}
                className={`p-3 border rounded-lg ${getLogColor(log.type)}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold mb-1 capitalize">
                      {log.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-xs break-words font-mono">
                      {log.data}
                    </p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(log.data, log.id)}
                    className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied === log.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Documentation */}
      <div className="bg-accent/50 border border-accent rounded-lg p-6">
        <h3 className="font-semibold text-foreground mb-4">Webhook Configuration</h3>
        <div className="space-y-2 text-sm text-foreground">
          <p><strong>Endpoint:</strong> POST /api/cmd</p>
          <p><strong>Content-Type:</strong> application/json</p>
          <p><strong>Expected Body:</strong></p>
          <div className="bg-background p-3 rounded font-mono text-xs mt-2 overflow-x-auto">
            {'{'}
            <br />
            &nbsp;&nbsp;"object": "page",
            <br />
            &nbsp;&nbsp;"entry": [{'{'}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;"messaging": [{'{'}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"message": {'{'}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"text": "confession message"
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{'}'}
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;{'}'}]
            <br />
            &nbsp;&nbsp;{'}'}]
            <br />
            {'}'}
          </div>
        </div>
      </div>
    </div>
  )
}
