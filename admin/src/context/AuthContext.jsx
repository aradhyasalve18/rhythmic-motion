import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('admin_token'))
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('admin_user')
    return saved ? JSON.parse(saved) : null
  })

  const login = (newToken, userData) => {
    localStorage.setItem('admin_token', newToken)
    localStorage.setItem('admin_user', JSON.stringify(userData))
    setToken(newToken)
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    setToken(null)
    setUser(null)
  }

  useEffect(() => {
    if (token) {
      localStorage.setItem('admin_token', token)
    }
  }, [token])

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
