import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Sidebar from './Sidebar'
import MobileHeader from './MobileHeader'
import MobileFooter from './MobileFooter'

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setIsDarkMode(true)
    }
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Don't show layout on login page
  if (router.pathname === '/login') {
    return <main className={isDarkMode ? 'dark' : ''}>{children}</main>
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen`}>
      {/* Mobile Header - only show on small screens */}
      <div className="md:hidden">
        <MobileHeader 
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      </div>

      <div className="flex min-h-screen">
        {/* Sidebar - only show on medium screens and up */}
        <div className="hidden md:block">
          <Sidebar 
            isOpen={isSidebarOpen} 
            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
            isDarkMode={isDarkMode}
            toggleDarkMode={toggleDarkMode}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 bg-white dark:bg-gray-900 p-4">
          {children}
        </main>
      </div>

      {/* Mobile Footer - only show on small screens */}
      <div className="md:hidden">
        <MobileFooter />
      </div>
    </div>
  )
}