import { useState, useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styles from './Login.module.css'

const PASSWORD_RULES = [
  { test: (pw) => pw.length >= 8, label: 'At least 8 characters' },
  { test: (pw) => /[A-Z]/.test(pw), label: 'One uppercase letter' },
  { test: (pw) => /[a-z]/.test(pw), label: 'One lowercase letter' },
  { test: (pw) => /[^A-Za-z0-9]/.test(pw), label: 'One special character' },
]

function validatePassword(pw) {
  return PASSWORD_RULES.filter((r) => !r.test(pw)).map((r) => r.label)
}

export default function Login() {
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const { token, login } = useAuth()

  const from = location.state?.from?.pathname || '/dashboard'

  useEffect(() => {
    if (token) navigate(from, { replace: true })
  }, [token, from, navigate])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors([])

    if (!email.trim()) return setErrors(['Please enter your email'])
    if (!password) return setErrors(['Please enter a password'])

    if (isSignUp) {
      const pwErrors = validatePassword(password)
      if (pwErrors.length > 0) return setErrors(pwErrors)
      if (password !== confirmPassword)
        return setErrors(['Passwords do not match'])
    }

    setLoading(true)
    try {
      const endpoint = isSignUp ? '/auth/signup' : '/auth/login'
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}${endpoint}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), password }),
        }
      )

      const data = await response.json().catch(() => null)

      if (!response.ok) {
        return setErrors([data?.message || `${isSignUp ? 'Sign-up' : 'Login'} failed`])
      }

      login(data.token)
    } catch {
      setErrors(['Unable to reach the server. Please try again.'])
    } finally {
      setLoading(false)
    }
  }

  if (token) return null

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <Link to="/" className={styles.backLink}>&larr; Home</Link>
        <h1 className={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back'}</h1>
        <p className={styles.subtitle}>
          {isSignUp
            ? 'Sign up to start using CloudPipeline'
            : 'Sign in to your CloudPipeline account'}
        </p>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email" className={styles.label}>Email</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isSignUp ? 'new-password' : 'current-password'}
            />
          </div>

          {isSignUp && (
            <>
              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword" className={styles.label}>
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  className={styles.input}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>

              <ul className={styles.rules}>
                {PASSWORD_RULES.map((rule) => {
                  const passing = rule.test(password)
                  return (
                    <li key={rule.label} className={passing ? styles.rulePass : styles.ruleFail}>
                      {passing ? '\u2713' : '\u2022'} {rule.label}
                    </li>
                  )
                })}
              </ul>
            </>
          )}

          {errors.length > 0 && (
            <div className={styles.errorBox}>
              {errors.map((msg) => (
                <p key={msg}>{msg}</p>
              ))}
            </div>
          )}

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Please wait\u2026' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <p className={styles.toggle}>
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            type="button"
            className={styles.toggleBtn}
            onClick={() => {
              setIsSignUp(!isSignUp)
              setErrors([])
            }}
          >
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}
