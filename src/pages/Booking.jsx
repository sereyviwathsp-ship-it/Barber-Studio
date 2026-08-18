import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { loadServices } from '../firebase/services'
import { saveBooking, computeDepositSplit } from '../firebase/bookings'
import MyBookings from '../components/MyBookings'

const DEFAULT_SERVICES = [
  { id: 'svc-signature', name: 'Signature Haircut & Styling', desc: 'Precision cut, hot towel finish, and styling.', price: 25, duration: '45 mins' },
  { id: 'svc-beard', name: 'Beard Sculpting & Trim', desc: 'Line-up, razor finish, and beard oil treatment.', price: 15, duration: '30 mins' },
  { id: 'svc-gentleman', name: 'The Complete Gentleman', desc: 'Haircut, beard trim, and facial cleanse.', price: 35, duration: '75 mins' },
]

const timeSlots = ['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM']

export default function Booking() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState(1)
  const [services, setServices] = useState(DEFAULT_SERVICES)
  const [selectedServices, setSelectedServices] = useState([])
  const [selectedTime, setSelectedTime] = useState(null)
  const [clientName, setClientName] = useState(user?.name || '')
  const [clientPhone, setClientPhone] = useState('')

  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [nameOnCard, setNameOnCard] = useState('')

  const [isConfirmed, setIsConfirmed] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [confirmedInfo, setConfirmedInfo] = useState(null)

  useEffect(() => {
    loadServices()
      .then((list) => { if (list.length) setServices(list) })
      .catch(() => {})
  }, [])

  const toggleService = (service) => {
    if (selectedServices.find((s) => s.id === service.id)) {
      setSelectedServices(selectedServices.filter((s) => s.id !== service.id))
    } else {
      setSelectedServices([...selectedServices, service])
    }
  }

  const totalAmount = selectedServices.reduce((sum, s) => sum + s.price, 0)
  const { depositAmount, balanceDueAtStore } = computeDepositSplit(totalAmount)

  const handleConfirm = async () => {
    if (!user) return
    setIsSaving(true)
    setSaveError('')
    try {
      const booking = await saveBooking(
        user,
        {
          name: clientName,
          phone: clientPhone,
          services: selectedServices.map((s) => s.name),
          time: selectedTime,
          total: totalAmount,
        },
        { cardNumber, expiry, cvc, nameOnCard },
      )
      setConfirmedInfo({
        name: clientName,
        phone: clientPhone,
        time: selectedTime,
        total: totalAmount,
        deposit: booking.payment.depositAmount,
        balance: booking.payment.balanceDueAtStore,
        cardDisplay: booking.payment.cardDisplay ?? null,
      })
      setIsConfirmed(true)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Could not save your booking. Check your connection and try again.')
    }
    setIsSaving(false)
  }

  const header = (
    <div className="text-center mb-10">
      <span className="text-[11px] uppercase tracking-[0.25em] text-red-500 font-semibold mb-2 block">
        RESERVATION PORTAL
      </span>
      <h1 className="font-serif text-3xl sm:text-4xl text-white">
        Chair <span className="text-red-600">Booking</span>
      </h1>
      <p className="text-white/50 text-sm mt-2">Secure your slot with a 50% card deposit — pay the rest in-store.</p>
    </div>
  )

  const infoStrip = (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-10">
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-4 text-center hover:border-red-600/30 transition-all">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-red-500 font-semibold mb-1.5">Open Daily</span>
        <p className="text-sm font-semibold text-white">9:00 AM – 8:00 PM</p>
        <p className="text-xs text-white/50 mt-1">Walk-ins welcome</p>
      </div>
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-4 text-center hover:border-red-600/30 transition-all">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-red-500 font-semibold mb-1.5">50/50 Payment</span>
        <p className="text-sm font-semibold text-white">Card Deposit + Store Balance</p>
        <p className="text-xs text-white/50 mt-1">Cash · KHQR · ABA at the counter</p>
      </div>
      <div className="bg-[#121216] border border-white/10 rounded-2xl p-4 text-center hover:border-red-600/30 transition-all">
        <span className="block text-[10px] uppercase tracking-[0.2em] text-red-500 font-semibold mb-1.5">Find Us</span>
        <p className="text-sm font-semibold text-white">Phnom Penh Flagship</p>
        <p className="text-xs text-white/50 mt-1">Reschedule via Telegram</p>
      </div>
    </div>
  )

  if (!user) {
    return (
      <div className="max-w-3xl mx-auto">
        {header}
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-white">Our Services</h2>
          <p className="text-white/50 text-sm mt-1">Browse freely — log in to reserve your chair.</p>
        </div>
        <div className="flex flex-col gap-3 mb-8">
          {services.map((service, i) => (
            <div key={service.id} className="flex justify-between items-center rounded-2xl px-5 py-4 bg-[#121216] border border-white/10">
              <div className="flex gap-4 items-start">
                <span className="font-serif text-red-600/70 text-base pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{service.name}</h3>
                  <p className="text-xs text-white/50 mt-1 max-w-xs leading-relaxed">{service.desc}</p>
                </div>
              </div>
              <div className="text-right shrink-0 pl-4">
                <span className="block font-bold text-white text-base">${service.price}</span>
                <span className="block text-white/40 text-xs mt-0.5">{service.duration}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#121216] border border-red-600/30 rounded-2xl p-8 text-center">
          <span className="inline-block text-[10px] uppercase tracking-[0.2em] text-red-500 font-semibold bg-red-600/10 border border-red-600/20 rounded-full px-3 py-1 mb-4">
            Members Only
          </span>
          <h2 className="font-serif text-2xl text-white mb-1.5">Log in to book your chair</h2>
          <p className="text-white/50 text-sm mb-6 max-w-sm mx-auto">
            Create a free account or log in to reserve a time slot. Browsing the studio is always open.
          </p>
          <button
            onClick={() => navigate('/auth')}
            className="bg-white text-black rounded-xl px-8 py-3.5 font-semibold text-sm uppercase tracking-wide hover:bg-red-600 hover:text-white transition-all cursor-pointer"
          >
            Log In / Sign Up →
          </button>
        </div>

        {infoStrip}
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto">
      {header}

      <div className="flex justify-between border-b border-white/10 pb-3 mb-8">
        <span className={`text-xs uppercase tracking-wide font-semibold transition-colors ${step === 1 ? 'text-red-500' : 'text-white/40'}`}>01. Options</span>
        <span className={`text-xs uppercase tracking-wide font-semibold transition-colors ${step === 2 ? 'text-red-500' : 'text-white/40'}`}>02. Time & Details</span>
        <span className={`text-xs uppercase tracking-wide font-semibold transition-colors ${step === 3 ? 'text-red-500' : 'text-white/40'}`}>03. Deposit</span>
      </div>

      {step === 1 && (
        <div>
          <div className="mb-5">
            <h2 className="text-lg font-semibold text-white">Select Services</h2>
            <p className="text-white/50 text-sm mt-1">Choose one or more grooming services for your session.</p>
          </div>
          <div className="flex flex-col gap-3 mb-8">
            {services.map((service, i) => {
              const isSelected = selectedServices.some((s) => s.id === service.id)
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service)}
                  className={`flex justify-between items-center rounded-2xl px-5 py-4 cursor-pointer transition-all hover:-translate-y-0.5 ${
                    isSelected ? 'bg-[#18181f] border border-red-600 shadow-lg shadow-red-950/40' : 'bg-[#121216] border border-white/10 hover:border-red-600/30'
                  }`}
                >
                  <div className="flex gap-4 items-start">
                    <span className="font-serif text-red-600/70 text-base pt-0.5">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <h3 className="text-sm font-semibold text-white">{service.name}</h3>
                      <p className="text-xs text-white/50 mt-1 max-w-xs leading-relaxed">{service.desc}</p>
                    </div>
                  </div>
                  <div className="text-right shrink-0 pl-4">
                    <span className="block font-bold text-white text-base">${service.price}</span>
                    <span className="block text-white/40 text-xs mt-0.5">{service.duration}</span>
                  </div>
                </div>
              )
            })}
          </div>
          <button
            disabled={selectedServices.length === 0}
            onClick={() => setStep(2)}
            className="w-full bg-white text-black rounded-xl py-3.5 font-semibold text-sm uppercase tracking-wide hover:bg-red-600 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-black cursor-pointer"
          >
            Continue to Schedule →
          </button>
        </div>
      )}

      {step === 2 && !isConfirmed && (
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-xs uppercase tracking-wide text-white/50 mb-2.5">Select Time Slot</label>
            <div className="grid grid-cols-3 gap-2.5">
              {timeSlots.map((time) => (
                <button
                  key={time}
                  type="button"
                  onClick={() => setSelectedTime(time)}
                  className={`text-sm py-2.5 rounded-lg border transition-all cursor-pointer ${
                    selectedTime === time ? 'bg-red-600/15 border-red-600 text-red-500 font-semibold' : 'bg-[#121216] border-white/10 text-white hover:border-red-600/30'
                  }`}
                >
                  {time}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Sok Dara"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-[#121216] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">Phone Number / Telegram</label>
              <input
                type="tel"
                placeholder="e.g. 012 345 678"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full bg-[#121216] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(1)} className="px-6 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/30 transition-all cursor-pointer">
              Back
            </button>
            <button
              disabled={!selectedTime || !clientName || !clientPhone}
              onClick={() => setStep(3)}
              className="flex-1 bg-white text-black rounded-xl py-3.5 font-semibold text-sm uppercase tracking-wide hover:bg-red-600 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            >
              Continue to Deposit →
            </button>
          </div>
        </div>
      )}

      {step === 3 && !isConfirmed && (
        <div className="flex flex-col gap-6">
          <div className="bg-[#121216] border border-red-600/30 rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white mb-3">Payment Summary</h3>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between"><span className="text-white/50">Total service cost</span><strong className="text-white">${totalAmount.toFixed(2)}</strong></div>
              <div className="flex justify-between"><span className="text-white/50">Due now (50% card deposit)</span><strong className="text-red-500">${depositAmount.toFixed(2)}</strong></div>
              <div className="flex justify-between"><span className="text-white/50">Due at store (50% balance)</span><strong className="text-white">${balanceDueAtStore.toFixed(2)}</strong></div>
            </div>
            <p className="text-[11px] text-white/40 mt-3 leading-relaxed">
              This is a demo payment form. No real charge is made — see the PaymentService stub in source for details.
              Use test card 4242 4242 4242 4242, any future expiry, any 3-digit CVC.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            <div>
              <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">Name on Card</label>
              <input
                type="text"
                placeholder="e.g. Sok Dara"
                value={nameOnCard}
                onChange={(e) => setNameOnCard(e.target.value)}
                className="w-full bg-[#121216] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">Card Number</label>
              <input
                type="text"
                inputMode="numeric"
                placeholder="4242 4242 4242 4242"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="w-full bg-[#121216] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">Expiry (MM/YY)</label>
                <input
                  type="text"
                  placeholder="12/29"
                  value={expiry}
                  onChange={(e) => setExpiry(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">CVC</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="123"
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="w-full bg-[#121216] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all"
                />
              </div>
            </div>
          </div>

          {saveError && <p className="text-red-500 text-xs">{saveError}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={() => setStep(2)} className="px-6 rounded-xl border border-white/10 text-white/60 text-sm hover:text-white hover:border-white/30 transition-all cursor-pointer">
              Back
            </button>
            <button
              disabled={!cardNumber || !expiry || !cvc || !nameOnCard || isSaving}
              onClick={handleConfirm}
              className="flex-1 bg-white text-black rounded-xl py-3.5 font-semibold text-sm uppercase tracking-wide hover:bg-red-600 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSaving ? 'Processing deposit…' : `Pay $${depositAmount.toFixed(2)} Deposit →`}
            </button>
          </div>
        </div>
      )}

      {isConfirmed && confirmedInfo && (
        <div className="text-center bg-[#121216] border border-white/10 rounded-2xl p-8">
          <div className="text-2xl text-red-600 mb-3">✓</div>
          <h2 className="font-serif text-2xl text-white mb-1.5">Booking Confirmed</h2>
          <p className="text-white/50 text-sm mb-7">We look forward to seeing you at Barber Studio, Phnom Penh.</p>

          <div className="bg-[#0a0a0c] border border-white/10 rounded-xl p-5 flex flex-col gap-2.5 text-left mb-4">
            <div className="flex justify-between text-sm"><span className="text-white/50">Name:</span><strong className="text-white font-semibold">{confirmedInfo.name}</strong></div>
            <div className="flex justify-between text-sm"><span className="text-white/50">Phone:</span><strong className="text-white font-semibold">{confirmedInfo.phone}</strong></div>
            <div className="flex justify-between text-sm"><span className="text-white/50">Time Slot:</span><strong className="text-red-500 font-semibold">{confirmedInfo.time}</strong></div>
            <div className="flex justify-between text-sm"><span className="text-white/50">Total:</span><strong className="text-white font-semibold">${confirmedInfo.total.toFixed(2)}</strong></div>
            <div className="flex justify-between text-sm"><span className="text-white/50">Deposit paid ({confirmedInfo.cardDisplay}):</span><strong className="text-green-400 font-semibold">${confirmedInfo.deposit.toFixed(2)}</strong></div>
            <div className="flex justify-between text-sm"><span className="text-white/50">Balance due at store:</span><strong className="text-white font-semibold">${confirmedInfo.balance.toFixed(2)}</strong></div>
          </div>

          <div className="bg-red-600/10 border border-red-600/30 rounded-xl p-4 text-left mb-7">
            <h3 className="text-sm font-semibold text-red-500 mb-1">Remember</h3>
            <p className="text-xs text-white/60 leading-relaxed">
              Bring cash, KHQR, or ABA to settle the remaining ${confirmedInfo.balance.toFixed(2)} at the store when you arrive.
            </p>
          </div>

          <button
            onClick={() => { setIsConfirmed(false); setConfirmedInfo(null); setStep(1); setSelectedServices([]); setSelectedTime(null); setCardNumber(''); setExpiry(''); setCvc(''); setNameOnCard('') }}
            className="w-full border border-white/10 rounded-xl py-3.5 font-semibold text-sm uppercase tracking-wide text-white/70 hover:border-red-600/40 hover:text-white transition-all cursor-pointer"
          >
            Book Another Session
          </button>
        </div>
      )}

      <MyBookings user={user} refreshKey={isConfirmed} />

      {infoStrip}
    </div>
  )
}
