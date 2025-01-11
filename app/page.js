'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import Head from 'next/head';


const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const router = useRouter();

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDark);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setDeferredPrompt(null);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    // Simple credential check - in production, use Supabase Auth
    if (username === 'admin' && password === 'admin123') {
      localStorage.setItem('isAuthenticated', 'true');
      router.push('/dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col py-12 px-4 sm:px-6 lg:px-8 ${
        darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'
      }`}
    >
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content={darkMode ? '#1a202c' : '#ffffff'} />
      </Head>

      {/* Header */}
      <header className="flex justify-between items-center px-4 sm:px-6 lg:px-8 mb-8">
        <button
          onClick={toggleDarkMode}
          className="text-sm font-medium py-2 px-4 rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>
      </header>

      {/* Login Form */}
      <div className="flex-grow flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold">Sign in to your account</h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <input
                  type="email"
                  required
                  className={`appearance-none rounded-t-md relative block w-full px-3 py-2 border placeholder-gray-500 focus:outline-none sm:text-sm ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div>
                <input
                  type="password"
                  required
                  className={`appearance-none rounded-b-md relative block w-full px-3 py-2 border placeholder-gray-500 focus:outline-none sm:text-sm ${
                    darkMode
                      ? 'bg-gray-700 border-gray-600 text-white focus:ring-blue-500 focus:border-blue-500'
                      : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 focus:border-blue-500'
                  }`}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Sign in
              </button>
            </div>
          </form>

          <div className="flex justify-between items-center mt-4">
            {deferredPrompt && (
              <button
                onClick={handleInstall}
                className="text-blue-600 hover:text-blue-500"
              >
                Install as App
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

export async function getServerSideProps() {
  return { props: {} };
}
