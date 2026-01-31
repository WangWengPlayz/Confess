'use client'

import { useState, useEffect } from 'react'
import AdminDashboard from '@/components/admin/AdminDashboard'
import LoginForm from '@/components/admin/LoginForm'

// Prevent static pre-rendering of this page
export const dynamic = 'force-dynamic'

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const token = localStorage.getItem('adminToken')
    setIsLoggedIn(!!token)
    setLoading(false)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-background to-muted">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return isLoggedIn ? <AdminDashboard /> : <LoginForm />
}
