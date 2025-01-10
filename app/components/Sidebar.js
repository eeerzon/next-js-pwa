export default function Sidebar({ isOpen, toggleSidebar, isDarkMode, toggleDarkMode }) {
  return (
    <div className={`
      ${isOpen ? 'w-64' : 'w-20'} 
      h-screen 
      bg-gray-800 
      dark:bg-gray-900 
      text-white 
      transition-all 
      duration-300 
      ease-in-out
      fixed
    `}>
      <div className="p-4">
        <button onClick={toggleSidebar} className="w-full text-left">
          {isOpen ? '← Collapse' : '→'}
        </button>
        
        <nav className="mt-8">
          <ul className="space-y-2">
            <li>
              <a href="/dashboard" className="block py-2 px-4 hover:bg-gray-700">
                {isOpen ? 'Dashboard' : '📊'}
              </a>
            </li>
            <li>
              <a href="/profile" className="block py-2 px-4 hover:bg-gray-700">
                {isOpen ? 'Profile' : '👤'}
              </a>
            </li>
            <li>
              <button 
                onClick={toggleDarkMode}
                className="w-full text-left py-2 px-4 hover:bg-gray-700"
              >
                {isOpen ? 'Toggle Theme' : '🌓'}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  )
}