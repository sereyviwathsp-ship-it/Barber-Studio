import { useEffect, useState } from 'react'
import { loadAllBookings } from '../../firebase/bookings'

export default function AdminOverview() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadAllBookings()
      .then(setBookings)
      .catch(() => setBookings([]))
      .finally(() => setLoading(false))
  }, [])

  // Handles both new 50/50 bookings and older bookings
  // that do not have a `payment` object yet.
  const totalRevenue = bookings.reduce(
    (sum, booking) => sum + (Number(booking.total) || 0),
    0
  )

  const depositsCollected = bookings.reduce(
    (sum, booking) => sum + (Number(booking.payment?.depositAmount) || 0),
    0
  )

  const balanceOutstanding = bookings
    .filter((booking) => booking.payment?.status !== 'paid_in_full')
    .reduce(
      (sum, booking) =>
        sum + (Number(booking.payment?.balanceDueAtStore) || 0),
      0
    )

  const cards = [
    { label: 'Total Bookings', value: bookings.length },
    {
      label: 'Total Revenue (booked)',
      value: `$${totalRevenue.toFixed(2)}`,
    },
    {
      label: 'Deposits Collected',
      value: `$${depositsCollected.toFixed(2)}`,
    },
    {
      label: 'Balance Outstanding (in-store)',
      value: `$${balanceOutstanding.toFixed(2)}`,
    },
  ]

  if (loading) {
    return <p className="text-white/40 text-sm">Loading overview…</p>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="bg-[#121216] border border-white/10 rounded-2xl p-5"
        >
          <span className="block text-[10px] uppercase tracking-[0.2em] text-red-500 font-semibold mb-2">
            {card.label}
          </span>

          <span className="block text-2xl font-bold text-white">
            {card.value}
          </span>
        </div>
      ))}
    </div>
  )
}
