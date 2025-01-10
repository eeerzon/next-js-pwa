import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import styles from '../styles/Login.module.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const router = useRouter()

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
    })
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    if (username === 'admin' && password === 'admin123') {
      router.push('/customer-input')
    } else {
      setError('Invalid credentials')
    }
  }

  const handleInstall = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt()
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt')
        }
        setDeferredPrompt(null)
      })
    }
  }

  return (
    <div className={styles.container}>
      <h1>Login</h1>
      <form onSubmit={handleLogin} className={styles.form}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
        />
        <button type="submit" className={styles.button}>Login</button>
      </form>
      {error && <p className={styles.error}>{error}</p>}
      {deferredPrompt && (
        <button onClick={handleInstall} className={styles.installButton}>
          Install App
        </button>
      )}
    </div>
  )
}

