import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { loadQuestions, submitQuestion } from '../firebase/questions'

const faqs = [
  { q: 'Where are you located?', a: 'We are located in the heart of Phnom Penh, open daily from 9:00 AM to 8:00 PM.' },
  { q: 'How does the deposit work?', a: 'You pay 50% of your total by card when you book online. The remaining 50% is due in person at the store — cash, KHQR, or ABA.' },
  { q: 'What if I need to reschedule?', a: 'You can easily update your appointment by reaching out to us via Telegram or phone call.' },
]

export default function FAQ() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [openIndex, setOpenIndex] = useState(0)
  const [questions, setQuestions] = useState([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [questionText, setQuestionText] = useState('')
  const [isPosting, setIsPosting] = useState(false)

  useEffect(() => {
    loadQuestions()
      .then(setQuestions)
      .catch(() => {})
      .finally(() => setLoadingQuestions(false))
  }, [])

  const handleAsk = async () => {
    if (!questionText.trim() || !user) return
    setIsPosting(true)
    try {
      const saved = await submitQuestion(user, questionText.trim())
      setQuestions([saved, ...questions])
      setQuestionText('')
    } catch {
      // Silent fail keeps the UI simple — the text stays in the box so nothing is lost.
    }
    setIsPosting(false)
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-[11px] uppercase tracking-[0.25em] text-red-500 font-semibold mb-2 block">GOOD TO KNOW</span>
        <h1 className="font-serif text-3xl sm:text-4xl text-white">
          Frequently Asked <span className="text-red-600">Questions</span>
        </h1>
        <p className="text-white/50 text-sm mt-2">Everything you need to know about Barber Studio.</p>
      </div>

      <div className="flex flex-col gap-3">
        {faqs.map((faq, index) => {
          const isOpen = openIndex === index
          return (
            <div key={index} className={`bg-[#121216] border rounded-2xl transition-all ${isOpen ? 'border-red-600/40' : 'border-white/10 hover:border-red-600/30'}`}>
              <button
                onClick={() => setOpenIndex(isOpen ? -1 : index)}
                className="w-full flex justify-between items-center gap-4 p-5 text-left bg-transparent border-none cursor-pointer"
              >
                <span className="text-sm font-semibold text-white">{faq.q}</span>
                <span className={`text-red-500 text-lg leading-none shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>+</span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-xs text-white/50 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>

      <div className="mt-12">
        <div className="mb-4">
          <span className="text-[11px] uppercase tracking-[0.25em] text-red-500 font-semibold block mb-1">STILL CURIOUS?</span>
          <h2 className="font-serif text-2xl text-white">Ask a Question</h2>
        </div>

        {user ? (
          <div className="bg-[#121216] border border-white/10 rounded-2xl p-5">
            <textarea
              rows={3}
              placeholder="Type your question for the studio..."
              value={questionText}
              onChange={(e) => setQuestionText(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all resize-none"
            />
            <div className="flex justify-between items-center mt-3">
              <span className="text-[11px] text-white/30">Posting as {user.name}</span>
              <button
                onClick={handleAsk}
                disabled={!questionText.trim() || isPosting}
                className="bg-white text-black rounded-lg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider hover:bg-red-600 hover:text-white transition-all disabled:opacity-25 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPosting ? 'Posting…' : 'Submit Question →'}
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-[#121216] border border-red-600/30 rounded-2xl p-6 text-center">
            <p className="text-white/50 text-sm mb-4">Have a question for the studio? Log in or create a free account to ask.</p>
            <button
              onClick={() => navigate('/auth')}
              className="border border-red-600/50 rounded-lg px-5 py-2.5 text-xs font-semibold uppercase tracking-wider text-red-500 hover:bg-red-600 hover:text-white transition-all bg-transparent cursor-pointer"
            >
              Log In to Ask →
            </button>
          </div>
        )}

        {loadingQuestions ? (
          <p className="text-center text-white/30 text-xs mt-6">Loading questions…</p>
        ) : questions.length > 0 ? (
          <div className="flex flex-col gap-3 mt-6">
            {questions.map((q) => (
              <div key={q.id} className="bg-[#121216] border border-white/10 rounded-2xl p-5">
                <div className="flex justify-between items-center gap-4">
                  <span className="text-xs font-semibold text-white">{q.name}</span>
                  <span className="text-[10px] uppercase tracking-wider text-amber-500 bg-amber-500/10 border border-amber-500/20 rounded-full px-2.5 py-1 shrink-0">
                    {q.answer ? 'Answered' : 'Pending answer'}
                  </span>
                </div>
                <p className="text-xs text-white/50 mt-2 leading-relaxed">{q.text}</p>
                {q.answer && <p className="text-xs text-white mt-2 leading-relaxed border-t border-white/5 pt-2">→ {q.answer}</p>}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-white/30 text-xs mt-6">No questions yet — be the first to ask.</p>
        )}
      </div>
    </div>
  )
}
