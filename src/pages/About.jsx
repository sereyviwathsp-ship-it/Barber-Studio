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

const values = [
  {
    id: '01',
    title: 'Precision First',
    desc: 'Every cut starts with a consultation. We shape the plan around your face, hair type, and lifestyle before a single clip touches your head.',
  },
  {
    id: '02',
    title: 'Honest Craft',
    desc: 'No upselling, no rushed chairs. Our barbers take the time a great cut actually requires — nothing more, nothing less.',
  },
  {
    id: '03',
    title: 'A Room to Relax In',
    desc: 'Hot towels, quiet conversation, private chairs. The studio is built to feel like a break from your day, not another errand.',
  },
]

const timeline = [
  { year: '2026', label: 'Barber Studio opens its doors in Phnom Penh, built around a small team of specialists rather than a large rotating staff.' },
  { year: 'Today', label: 'A growing base of regulars who book the same barber, the same chair, every time.' },
]

export default function About() {
  const navigate = useNavigate()

  return (
    <div>
      <section className="relative overflow-hidden rounded-3xl border border-white/10 mb-14">
        <div className="absolute inset-0 bg-[#0a0a0c]" />
        <div className="gradient-blob animate-drift-a w-[420px] h-[420px] bg-red-900/40 -top-32 -left-24" />
        <div className="gradient-blob animate-drift-b w-[380px] h-[380px] bg-red-700/25 -bottom-36 -right-20" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none" />

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="relative z-10 flex flex-col justify-center min-h-[40vh] px-6 sm:px-12 py-16 sm:py-20"
        >
          <motion.div variants={item} className="flex items-center gap-2.5 mb-6">
            <ScissorsIcon className="w-4 h-4 text-white/70" />
            <span className="text-white/70 text-xs sm:text-sm tracking-[0.3em] uppercase">
              Our Story
            </span>
          </motion.div>

          <motion.h1
            variants={item}
            className="font-serif uppercase text-white leading-[0.95] tracking-tight text-[clamp(2.4rem,6vw,4.5rem)]"
          >
            Built On<br />
            <span className="text-red-600">Craft, Not Volume.</span>
          </motion.h1>

          <motion.p variants={item} className="text-white/70 text-sm sm:text-base leading-relaxed max-w-lg mt-6">
            Barber Studio started as a simple idea: a barbershop where every chair gets the same
            level of attention as the last. <span className="text-white font-semibold">No shortcuts, no rush.</span>
          </motion.p>
        </motion.div>
      </section>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-14">
        {values.map((v) => (
          <div key={v.id} className="bg-[#121216] border border-white/10 rounded-2xl p-5 hover:border-red-600/30 hover:-translate-y-0.5 transition-all">
            <span className="font-serif text-red-600/70 text-sm">{v.id}</span>
            <h3 className="text-sm font-semibold text-white mt-1.5">{v.title}</h3>
            <p className="text-xs text-white/50 mt-1.5 leading-relaxed">{v.desc}</p>
          </div>
        ))}
      </div>

      <div className="mb-14">
        <div className="mb-4">
          <span className="text-[11px] uppercase tracking-[0.25em] text-red-500 font-semibold block mb-1">Since Day One</span>
          <h2 className="font-serif text-2xl text-white">Where We've Been</h2>
        </div>
        <div className="flex flex-col gap-3">
          {timeline.map((t) => (
            <div key={t.year} className="flex items-start gap-4 bg-[#121216] border border-white/10 rounded-2xl px-5 py-4">
              <span className="font-serif text-red-600/70 text-base shrink-0 w-16">{t.year}</span>
              <p className="text-xs text-white/60 leading-relaxed">{t.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between bg-[#121216] border border-white/10 rounded-2xl px-6 py-8 flex-wrap gap-6">
        <div className="flex items-center gap-4">
          <AwardIcon className="w-8 h-8 text-white/50 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-white">Come see the studio for yourself</h3>
            <p className="text-xs text-white/50 mt-1">Phnom Penh Flagship Studio · Book your chair today</p>
          </div>
        </div>
        <button
          onClick={() => navigate('/booking')}
          className="group inline-flex items-center gap-2 bg-white text-black px-6 py-3 text-[11px] font-semibold tracking-widest uppercase rounded-xl hover:bg-red-600 hover:text-white transition-all cursor-pointer shrink-0"
        >
          Book Your Chair
          <ArrowUpRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
    </div>
  )
}