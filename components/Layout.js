import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import Link from 'next/link'
import styles from '../styles/Layout.module.css'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  return (
    <div className={styles.layout}>
      <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className={styles.toggleButton}>
          {sidebarOpen ? 'Close' : 'Open'} Sidebar
        </button>
        <nav>
          <Link href="/customer-input">Input Customer</Link>
          <Link href="/customer-list">Customer List</Link>
        </nav>
        <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={styles.themeToggle}>
          Toggle Dark Mode
        </button>
      </aside>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1>Customer Management</h1>
        </header>
        <main>{children}</main>
        <footer className={styles.footer}>
          <p>&copy; 2023 Customer Management PWA</p>
        </footer>
      </div>
    </div>
  )
}

