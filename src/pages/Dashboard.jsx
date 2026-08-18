import { useAuth } from '../hooks/useAuth'
import { Navigate, Link } from 'react-router-dom'
import MyBookings from '../components/MyBookings'

export default function Dashboard() {
  const { user, loading } = useAuth()

  if (loading) {
    return <p className="text-center text-white/40 text-sm mt-20">Loading…</p>
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  return (
    <div>
      <div className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-red-500 font-semibold mb-2 block">
          MEMBERS AREA
        </span>
        <h1 className="font-serif text-3xl text-white">Welcome back, {user.name}</h1>
        <p className="text-white/50 text-sm mt-2">
          Here's a look at your bookings.{' '}
          <Link to="/booking" className="text-red-500 hover:text-red-400">
            Book another chair →
          </Link>
        </p>
      </div>

      <MyBookings user={user} />
    </div>
  )
}