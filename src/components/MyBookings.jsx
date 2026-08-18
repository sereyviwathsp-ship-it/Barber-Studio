import { useEffect, useState } from 'react'
import { loadUserBookings } from '../firebase/bookings'

export default function MyBookings({ user, refreshKey }) {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    loadUserBookings(user.uid)
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [user.uid, refreshKey])

  if (loading) return <p className="text-center text-white/30 text-xs mt-10">Loading your bookings…</p>
  if (bookings.length === 0) return null

  return (
    <div className="mt-12">
      <h2 className="text-lg font-semibold text-white mb-4">Your Bookings</h2>
      <div className="flex flex-col gap-3">
        {bookings.map((b) => (
          <div key={b.id} className="bg-[#121216] border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between items-start gap-4">
              <div>
                <h3 className="text-sm font-semibold text-white">{b.services.join(', ')}</h3>
                <p className="text-xs text-white/40 mt-1">{b.time} · {new Date(b.createdAt).toLocaleDateString()}</p>
              </div>
              <span
                className={`text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 shrink-0 ${
                  b.payment.status === 'paid_in_full'
                    ? 'text-green-400 bg-green-500/10 border border-green-500/20'
                    : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
                }`}
              >
                {b.payment.status === 'paid_in_full' ? 'Paid in full' : 'Deposit paid'}
              </span>
            </div>
            <div className="flex justify-between text-xs text-white/50 mt-3 pt-3 border-t border-white/5">
              <span>Deposit: ${b.payment.depositAmount.toFixed(2)}</span>
              <span>Due at store: ${b.payment.balanceDueAtStore.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
