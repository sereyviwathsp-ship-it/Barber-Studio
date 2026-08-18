import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="text-center text-white/40 text-sm mt-20">Checking access…</p>
  }

  if (!user || !user.isAdmin) {
    return <Navigate to="/" replace />
  }

  return <>{children}</>
}