import React, { createContext, useState, useContext, useCallback } from 'react'
import useIdleTimer from '../hooks/useIdleTimer'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem('api_token') || null)

  const login = (newToken) => {
    setToken(newToken)
    localStorage.setItem('api_token', newToken)
  }

  const logout = useCallback(() => {
    setToken(null)
    localStorage.removeItem('api_token')
  }, [])

  useIdleTimer(logout, !!token)

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
