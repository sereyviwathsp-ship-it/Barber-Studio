import { useEffect, useState } from 'react'
import { loadQuestions, answerQuestion } from '../../firebase/questions'

export default function AdminQuestions() {
  const [questions, setQuestions] = useState([])
  const [loading, setLoading] = useState(true)
  const [drafts, setDrafts] = useState({})

  const refresh = () => {
    setLoading(true)
    loadQuestions().then(setQuestions).catch(() => setQuestions([])).finally(() => setLoading(false))
  }

  useEffect(() => { refresh() }, [])

  const handleAnswer = async (id) => {
    const answer = drafts[id]?.trim()
    if (!answer) return
    await answerQuestion(id, answer)
    refresh()
  }

  if (loading) return <p className="text-white/40 text-sm">Loading questions…</p>
  if (questions.length === 0) return <p className="text-white/40 text-sm">No questions yet.</p>

  return (
    <div className="flex flex-col gap-3">
      {questions.map((q) => (
        <div key={q.id} className="bg-[#121216] border border-white/10 rounded-2xl p-5">
          <div className="flex justify-between items-center gap-4">
            <span className="text-xs font-semibold text-white">{q.name}</span>
            <span className={`text-[10px] uppercase tracking-wider rounded-full px-2.5 py-1 shrink-0 ${q.answer ? 'text-green-400 bg-green-500/10 border border-green-500/20' : 'text-amber-500 bg-amber-500/10 border border-amber-500/20'}`}>
              {q.answer ? 'Answered' : 'Pending'}
            </span>
          </div>
          <p className="text-xs text-white/50 mt-2 leading-relaxed">{q.text}</p>
          {q.answer ? (
            <p className="text-xs text-white mt-2 leading-relaxed border-t border-white/5 pt-2">→ {q.answer}</p>
          ) : (
            <div className="flex gap-2 mt-3">
              <input
                type="text"
                placeholder="Write a public answer…"
                value={drafts[q.id] || ''}
                onChange={(e) => setDrafts({ ...drafts, [q.id]: e.target.value })}
                className="flex-1 bg-[#0a0a0c] border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all"
              />
              <button
                onClick={() => handleAnswer(q.id)}
                className="text-xs font-semibold uppercase tracking-wide bg-white text-black rounded-lg px-3 py-2 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
              >
                Post
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
