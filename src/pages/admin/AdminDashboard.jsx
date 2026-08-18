import { NavLink, Outlet } from 'react-router-dom'

const tabs = [
  { to: '/admin', label: 'Overview', end: true },
  { to: '/admin/bookings', label: 'Bookings' },
  { to: '/admin/questions', label: 'Questions' },
]

export default function AdminDashboard() {
  return (
    <div>
      <div className="mb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-red-500 font-semibold mb-2 block">STAFF ONLY</span>
        <h1 className="font-serif text-3xl text-white">Admin Dashboard</h1>
        <p className="text-white/50 text-sm mt-2">
          Manage bookings, deposits, and customer questions. Access is restricted to entries in the
          <code className="text-white/70 mx-1">admins</code>
          Firestore collection.
        </p>
      </div>

      <div className="flex gap-2 mb-8 border-b border-white/10 pb-3">
        {tabs.map((t) => (
          <NavLink
            key={t.to}
            to={t.to}
            end={t.end}
            className={({ isActive }) =>
              `text-xs uppercase tracking-wide font-semibold px-3 py-2 rounded-md transition-colors ${
                isActive ? 'text-red-500 bg-white/5' : 'text-white/50 hover:text-white'
              }`
            }
          >
            {t.label}
          </NavLink>
        ))}
      </div>

      <Outlet />
    </div>
  )
}
