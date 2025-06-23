/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable service worker related features in development
  experimental: {
    // Disable any PWA features that might interfere
    webVitalsAttribution: ['CLS', 'LCP']
  },
  headers: async () => {
    return [
      {
        // Disable caching for development
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-cache, no-store, must-revalidate'
          },
          {
            key: 'Pragma', 
            value: 'no-cache'
          },
          {
            key: 'Expires',
            value: '0'
          }
        ],
      },
    ]
  },
}

module.exports = nextConfig