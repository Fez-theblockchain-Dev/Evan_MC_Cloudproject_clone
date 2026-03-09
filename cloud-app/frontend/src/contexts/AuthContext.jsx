import React, { createContext, useState, useContext, useCallback } from 'react'
import useIdleTimer from '../hooks/useIdleTimer'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null)

  const login = (newToken) => {
    setToken(newToken)
    localStorage.setItem('auth_token', newToken)
  }

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem('auth_token')
  }, [])

  useIdleTimer(logout, !!token)

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
