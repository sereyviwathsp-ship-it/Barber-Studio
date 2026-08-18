import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { ScissorsIcon, ArrowUpRightIcon, AwardIcon } from '../components/Icons'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.1 } },
}

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
}

const stats = [
  { value: '5+', label: 'Years of Craft' },
  { value: '1.2K+', label: 'Happy Clients' },
  { value: '3', label: 'Signature Services' },
]

const features = [
  { id: '01', title: 'Expert Barbers', desc: 'Master craftsmen specialized in modern fades and classic grooming rituals.', tags: ['5+ Yrs Experience', 'Certified'] },
  { id: '02', title: '50% Deposit, Rest In-Store', desc: 'Secure your slot with a small online card deposit; settle the balance at the counter.', tags: ['Card Deposit', 'Pay Balance In-Store'] },
  { id: '03', title: 'Premium Vibe', desc: 'A relaxed, high-end studio atmosphere designed around your comfort.', tags: ['Private Chairs', 'Hot Towel'] },
]

const services = [
  { name: 'Signature Haircut & Styling', price: 25, duration: '45 mins' },
  { name: 'Beard Sculpting & Trim', price: 15, duration: '30 mins' },
  { name: 'The Complete Gentleman', price: 35, duration: '75 mins' },
]

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 mb-14">
        <div className="absolute inset-0 bg-[#0a0a0c]" />
        <div className="gradient-blob animate-drift-a w-[420px] h-[420px] bg-red-900/40 -top-32 -left-24" />
        <div className="gradient-blob animate-drift-b w-[380px] h-[380px] bg-red-700/25 -bottom-36 -right-20" />
        <div className="gradient-blob animate-drift-c w-[240px] h-[240px] bg-red-600/20 top-1/3 right-1/4" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col justify-center min-h-[60vh] px-6 sm:px-12 py-16 sm:py-20"
        >
          <motion.div variants={item} className="flex items-center gap-2.5 mb-6">
            <ScissorsIcon className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-xs sm:text-sm tracking-[0.3em] uppercase">
              Est. 2026 — World-Class Grooming Studio
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-serif uppercase text-white leading-[0.95] tracking-tight text-[clamp(2.6rem,7vw,5.5rem)]"
          >
            Artisanal<br />
            Barber<br />
            <span className="text-red-600">Redefined.</span>
          </motion.h1>

          <motion.p variants={item} className="text-white/70 text-sm sm:text-base leading-relaxed max-w-md mt-6">
            Precision cuts, professional styling, and an elevated chair experience —{' '}
            <span className="text-white font-semibold">tailored to your standard.</span>
          </motion.p>

          <motion.div variants={item} className="flex flex-wrap items-center gap-4 sm:gap-6 mt-8">
            <button
              onClick={() => navigate('/booking')}
              className="group inline-flex items-center gap-2 bg-white text-black px-6 sm:px-7 py-3 sm:py-4 text-[11px] sm:text-xs font-semibold tracking-widest uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer"
            >
              Book Your Chair
              <ArrowUpRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>

            <div className="hidden sm:flex items-center gap-3">
              <AwardIcon className="w-8 h-8 text-white/50" />
              <div className="text-white/60 text-xs tracking-wider uppercase leading-relaxed">
                Phnom Penh<br />
                Flagship Studio
              </div>
            </div>
          </motion.div>

          <motion.div variants={item} className="flex flex-wrap gap-8 sm:gap-12 mt-10 sm:mt-12">
            {stats.map((stat) => (
              <div key={stat.label}>
                <div className="text-white text-2xl sm:text-4xl font-bold tracking-tight">{stat.value}</div>
                <div className="text-white/50 text-[10px] sm:text-xs tracking-widest uppercase mt-1">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
        {features.map((f) => (
          <div key={f.id} className="bg-[#121216] border border-white/10 rounded-2xl p-5 hover:border-red-600/30 hover:-translate-y-0.5 transition-all">
            <span className="font-serif text-red-600/70 text-sm">{f.id}</span>
            <h3 className="text-sm font-semibold text-white mt-1.5">{f.title}</h3>
            <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{f.desc}</p>
            <div className="flex flex-wrap gap-1.5 mt-3">
              {f.tags.map((tag) => (
                <span key={tag} className="text-[10px] uppercase tracking-wider text-red-500/90 bg-red-600/10 border border-red-600/20 rounded-full px-2.5 py-1">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-red-500 font-semibold block mb-1">The Menu</span>
            <h2 className="font-serif text-2xl text-white">Signature Services</h2>
          </div>
          <button
            onClick={() => navigate('/booking')}
            className="text-xs uppercase tracking-widest text-white/50 hover:text-red-500 transition-colors bg-transparent border-none cursor-pointer"
          >
            View & Book →
          </button>
        </div>
        <div className="flex flex-col gap-3">
          {services.map((s, i) => (
            <div
              key={s.name}
              onClick={() => navigate('/booking')}
              className="flex justify-between items-center bg-[#121216] border border-white/10 rounded-2xl px-5 py-4 cursor-pointer hover:border-red-600/30 hover:-translate-y-0.5 transition-all"
            >
              <div className="flex items-center gap-4">
                <span className="font-serif text-red-600/70 text-base">0{i + 1}</span>
                <div>
                  <h3 className="text-sm font-semibold text-white">{s.name}</h3>
                  <p className="text-xs text-white/40 mt-0.5">{s.duration}</p>
                </div>
              </div>
              <span className="font-bold text-white text-base">${s.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
