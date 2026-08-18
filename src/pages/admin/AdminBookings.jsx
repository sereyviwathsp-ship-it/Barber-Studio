import { useEffect, useState } from 'react'
import { loadAllBookings, markBalancePaidInStore, updateBookingStatus } from '../../firebase/bookings'

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const refresh = () => {
    setLoading(true)
    loadAllBookings().then(setBookings).catch(() => setBookings([])).finally(() => setLoading(false))
  }

  useEffect(() => { refresh() }, [])

  const handleMarkPaid = async (id) => {
    await markBalancePaidInStore(id)
    refresh()
  }

  const handleStatus = async (id, status) => {
    await updateBookingStatus(id, status)
    refresh()
  }

  if (loading) return <p className="text-white/40 text-sm">Loading bookings…</p>
  if (bookings.length === 0) return <p className="text-white/40 text-sm">No bookings yet.</p>

  return (
    <div className="flex flex-col gap-3">
      {bookings.map((b) => (
        <div key={b.id} className="bg-[#121216] border border-white/10 rounded-2xl p-5">
          <div className="flex justify-between items-start gap-4 flex-wrap">
            <div>
              <h3 className="text-sm font-semibold text-white">{b.name} · {b.phone}</h3>
              <p className="text-xs text-white/50 mt-1">{b.services.join(', ')}</p>
              <p className="text-xs text-white/30 mt-1">{b.time} · {new Date(b.createdAt).toLocaleString()}</p>
            </div>
            <div className="text-right">
              <span className="block text-xs text-white/50">Total ${(b.total ?? 0).toFixed(2)}</span>
              {b.payment ? (
                <>
                  <span className="block text-xs text-green-400">Deposit ${b.payment.depositAmount.toFixed(2)} paid</span>
                  <span className="block text-xs text-amber-500">Balance ${b.payment.balanceDueAtStore.toFixed(2)} due</span>
                </>
              ) : (
                <span className="block text-xs text-white/30">No payment info</span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5 flex-wrap">
            <span className={`text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 ${
              b.payment?.status === 'paid_in_full' ? 'text-green-400 bg-green-500/10 border border-green-500/20' : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'
            }`}>
              {b.payment?.status ? b.payment.status.replace(/_/g, ' ') : 'no payment'}
            </span>
            <span className="text-[10px] uppercase tracking-wider text-white/40 bg-white/5 border border-white/10 rounded-full px-2.5 py-1">
              {b.status}
            </span>

            <div className="ml-auto flex gap-2">
              {b.payment && b.payment.status !== 'paid_in_full' && (
                <button
                  onClick={() => handleMarkPaid(b.id)}
                  className="text-xs font-semibold uppercase tracking-wide bg-white text-black rounded-lg px-3 py-1.5 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                >
                  Mark Balance Paid
                </button>
              )}
              {b.status === 'confirmed' && (
                <>
                  <button
                    onClick={() => handleStatus(b.id, 'completed')}
                    className="text-xs font-semibold uppercase tracking-wide border border-white/10 text-white/70 rounded-lg px-3 py-1.5 hover:border-white/30 hover:text-white transition-all cursor-pointer"
                  >
                    Complete
                  </button>
                  <button
                    onClick={() => handleStatus(b.id, 'cancelled')}
                    className="text-xs font-semibold uppercase tracking-wide border border-red-600/30 text-red-500 rounded-lg px-3 py-1.5 hover:border-red-600 transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}