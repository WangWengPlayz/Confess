'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem('adminToken')
    if (!token) {
      router.push('/admin')
    }
  }, [router])

  return <AdminDashboard />
}
