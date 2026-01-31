'use client'

import React from "react"

import { useState } from 'react'
import { Heart, Send } from 'lucide-react'

export default function ConfessionForm() {
  const [message, setMessage] = useState('')
  const [authorName, setAuthorName] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/confessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          author_name: authorName || null,
          language: 'en'
        })
      })

      const data = await response.json()

      if (response.ok) {
        setSuccess(true)
        setMessage('')
        setAuthorName('')
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error || 'Failed to submit confession')
      }
    } catch (err) {
      setError('An error occurred. Please try again.')
      console.error('[v0] Confession submit error:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-card border-2 border-primary rounded-lg p-8 shadow-2xl">
      <div className="text-center mb-6">
        <Heart className="w-8 h-8 text-primary fill-primary mx-auto mb-2" />
        <h2 className="text-2xl font-bold text-foreground">Share Your Confession</h2>
        <p className="text-muted-foreground text-sm mt-2">
          Tell us your love story or secret feeling. Your confession will be reviewed before posting.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
            Your Name (optional)
          </label>
          <input
            id="name"
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Leave blank for anonymous confession"
            maxLength={50}
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground"
          />
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
            Your Confession
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Write your confession here... (Max 500 characters)"
            maxLength={500}
            rows={6}
            required
            className="w-full px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground placeholder-muted-foreground resize-none"
          />
          <p className="text-xs text-muted-foreground mt-1">
            {message.length}/500 characters
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm font-semibold flex items-center gap-2">
            <Heart className="w-4 h-4 fill-green-800" />
            Your confession has been submitted! It will appear after moderation.
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-sm font-semibold">
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="w-full bg-gradient-to-r from-primary to-secondary hover:from-secondary hover:to-primary text-white font-bold py-3 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
        >
          <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          {loading ? 'Submitting...' : 'Send Confession'}
        </button>
      </form>

      {/* Info */}
      <div className="mt-6 pt-6 border-t border-border">
        <p className="text-xs text-muted-foreground text-center">
          💌 All confessions are reviewed for content policy compliance before appearing publicly.
        </p>
      </div>
    </div>
  )
}
