#!/usr/bin/env node
// HTTPS-enabled production server
// Run with: NODE_ENV=production node server-https.js

import http from 'http'
import app from './server'
import { httpsServer, HttpsServer } from './config/https'

const HTTP_PORT = process.env.HTTP_PORT || 80
const HTTPS_PORT = process.env.HTTPS_PORT || 443
const HOST = process.env.API_HOST || '0.0.0.0'

// Generate development certificates if needed
if (process.env.NODE_ENV !== 'production') {
  HttpsServer.generateDevCertificate().catch(console.error)
}

// Create HTTP server (for redirect to HTTPS in production)
const httpServer = http.createServer((req, res) => {
  if (process.env.NODE_ENV === 'production') {
    // Redirect all HTTP traffic to HTTPS
    const httpsUrl = `https://${req.headers.host}${req.url}`
    res.writeHead(301, { Location: httpsUrl })
    res.end()
  } else {
    // In development, serve the app normally
    app(req, res)
  }
})

// Start HTTP server
httpServer.listen(HTTP_PORT, HOST, () => {
  console.log(`🔄 HTTP redirect server listening on http://${HOST}:${HTTP_PORT}`)
})

// Create and start HTTPS server if configured
if (httpsServer.isConfigured()) {
  const server = httpsServer.createServer(app)
  
  if (server) {
    server.listen(HTTPS_PORT, HOST, () => {
      console.log(`🔒 HTTPS server listening on https://${HOST}:${HTTPS_PORT}`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
    })

    // Graceful shutdown
    const gracefulShutdown = async (signal: string) => {
      console.log(`Received ${signal}. Starting graceful shutdown...`)
      
      // Close servers
      httpServer.close(() => {
        console.log('HTTP server closed')
      })
      
      server.close(() => {
        console.log('HTTPS server closed')
        process.exit(0)
      })

      // Force exit after 10 seconds
      setTimeout(() => {
        console.error('Forced shutdown after timeout')
        process.exit(1)
      }, 10000)
    }

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'))
    process.on('SIGINT', () => gracefulShutdown('SIGINT'))
  }
} else {
  console.warn('⚠️  HTTPS not configured. Running HTTP only.')
  console.log('To enable HTTPS:')
  console.log('  - In production: Set SSL_KEY and SSL_CERT environment variables')
  console.log('  - In development: Run the server once to auto-generate certificates')
}