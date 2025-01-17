// const withPWA = require('next-pwa')({
//   dest: 'public',
//   register: true,
//   skipWaiting: true,
// });

// module.exports = withPWA({
//   reactStrictMode: true,
// });

// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development'
})

module.exports = withPWA({
  images: {
    domains: ['localhost', 'https://ihhwhajrvkhditkpgjqv.supabase.co'],
  },
})
