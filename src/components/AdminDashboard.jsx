// src/components/Admin/AdminDashboard.jsx
import { useState, useEffect } from 'react'
import Login from './Login'
import AdminLayout from './AdminLayout'

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      // For Supabase auth, you might check the session
      // const { data: { session } } = await supabase.auth.getSession()
      // setIsAuthenticated(!!session)
      
      // For simple auth, check localStorage
      const isAdmin = localStorage.getItem('isAdmin') === 'true'
      setIsAuthenticated(isAdmin)
      setLoading(false)
    }
    
    checkAuth()
  }, [])

  const handleLogin = (success) => {
    setIsAuthenticated(success)
  }

  const handleLogout = () => {
    localStorage.removeItem('isAdmin')
    // If using Supabase auth: await supabase.auth.signOut()
    setIsAuthenticated(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div>
      {isAuthenticated ? (
        <AdminLayout onLogout={handleLogout} />
      ) : (
        <Login onLogin={handleLogin} />
      )}
    </div>
  )
}