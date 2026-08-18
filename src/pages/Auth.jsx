import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { signIn, signUp } from '../firebase/auth'

export default function Auth() {
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (mode === 'signup') {
        await signUp(name, email, password)
        navigate('/dashboard')
      } else {
        const loggedInUser = await signIn(email, password)
        navigate(loggedInUser.isAdmin ? '/admin' : '/dashboard')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <span className="text-[11px] uppercase tracking-[0.25em] text-red-500 font-semibold mb-2 block">MEMBERS AREA</span>
        <h1 className="font-serif text-3xl text-white">{mode === 'login' ? 'Welcome Back' : 'Create Account'}</h1>
      </div>

      <div className="bg-[#121216] border border-white/10 rounded-2xl p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all"
              />
            </div>
          )}
          <div>
            <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all"
            />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wide text-white/50 mb-2">Password</label>
            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-[#0a0a0c] border border-white/10 rounded-lg px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-red-600 transition-all"
            />
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-white text-black rounded-xl py-3.5 font-semibold text-sm uppercase tracking-wide hover:bg-red-600 hover:text-white transition-all disabled:opacity-25 cursor-pointer"
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Log In →' : 'Sign Up →'}
          </button>
        </form>

        <button
          onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
          className="w-full text-center text-xs text-white/50 hover:text-white mt-5 bg-transparent border-none cursor-pointer"
        >
          {mode === 'login' ? "Don't have an account? Sign up →" : 'Already have an account? Log in →'}
        </button>
      </div>
    </div>
  )
}