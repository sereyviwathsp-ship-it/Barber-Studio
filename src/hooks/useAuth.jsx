import { createContext, useContext, useEffect, useState } from 'react'
import { subscribeToAuthChanges } from '../firebase/auth'

const AuthContext = createContext({ user: null, loading: true })

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((u) => {
      setUser(u)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
