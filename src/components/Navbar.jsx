import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { signOut } from '../firebase/auth'

const links = [
  { to: '/', label: 'Home' },
  { to: '/booking', label: 'Booking' },
  { to: '/faq', label: 'FAQ' },
]

export default function Navbar() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <nav className="flex justify-between items-center bg-[#121216] border border-white/10 px-5 py-3 rounded-2xl mb-8">
      <NavLink to="/" className="font-serif text-xl font-bold tracking-tight">
        Barber<span className="text-red-600">.Studio</span>
      </NavLink>
      <div className="flex items-center gap-1.5">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors ${
                isActive ? 'text-red-500 bg-white/5 font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            {l.label}
          </NavLink>
        ))}
        {user && (
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors ${
                isActive ? 'text-red-500 bg-white/5 font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            Dashboard
          </NavLink>
        )}
        {user?.isAdmin && (
          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors ${
                isActive ? 'text-red-500 bg-white/5 font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            Admin
          </NavLink>
        )}
        {user ? (
          <button
            onClick={handleSignOut}
            className="text-xs font-medium px-2.5 py-1.5 rounded-md text-white/60 hover:text-white hover:bg-white/5 cursor-pointer bg-transparent border-none"
          >
            Log Out
          </button>
        ) : (
          <NavLink
            to="/auth"
            className={({ isActive }) =>
              `text-xs font-medium px-2.5 py-1.5 rounded-md transition-colors ${
                isActive ? 'text-red-500 bg-white/5 font-semibold' : 'text-white/60 hover:text-white hover:bg-white/5'
              }`
            }
          >
            Log In
          </NavLink>
        )}
      </div>
    </nav>
  )
}