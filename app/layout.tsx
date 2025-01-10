'use client'

import React, { useState } from 'react';
import { 
  Home, 
  Users, 
  UserPlus,
  Moon,
  Sun,
  Menu,
  X
} from 'lucide-react';

const Layout = ({ children }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [currentPath, setCurrentPath] = useState('/dashboard'); // Example state for active route

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Add Customer', href: '/customers/new', icon: UserPlus },
    { name: 'Customer List', href: '/customers', icon: Users },
  ];

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark' : ''}`}>
      <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
        {/* Sidebar for desktop */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64">
            <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white dark:bg-gray-800 border-r">
              <div className="flex items-center flex-shrink-0 px-4">
                <h1 className="text-xl font-semibold text-gray-800 dark:text-white">
                  Customer PWA
                </h1>
              </div>
              <nav className="flex-1 px-2 mt-5 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      currentPath === item.href
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPath(item.href);
                    }}
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Mobile header */}
        <div className="flex flex-col flex-1">
          <div className="md:hidden">
            <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 border-b">
              <button
                onClick={() => setSidebarOpen(true)}
                className="text-gray-500 hover:text-gray-600 dark:text-gray-300"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                Customer PWA
              </h1>
              <button
                onClick={toggleDarkMode}
                className="text-gray-500 hover:text-gray-600 dark:text-gray-300"
              >
                {isDarkMode ? (
                  <Sun className="w-6 h-6" />
                ) : (
                  <Moon className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>

          {/* Main content */}
          <main className="flex-1 overflow-y-auto">
            <div className="py-6">
              <div className="px-4 mx-auto max-w-7xl sm:px-6 md:px-8">
                {children}
              </div>
            </div>
          </main>
        </div>

        {/* Mobile sidebar */}
        {isSidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
            <div className="fixed inset-y-0 left-0 flex flex-col w-64 bg-white dark:bg-gray-800">
              <div className="flex items-center justify-between px-4 py-2 border-b">
                <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                  Customer PWA
                </h1>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="text-gray-500 hover:text-gray-600 dark:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <nav className="flex-1 px-2 mt-5 space-y-1">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      currentPath === item.href
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setCurrentPath(item.href);
                      setSidebarOpen(false);
                    }}
                  >
                    <item.icon className="w-6 h-6 mr-3" />
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;