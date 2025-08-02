import fs from 'fs'
import path from 'path'
import https from 'https'
import { Application } from 'express'

export interface HttpsConfig {
  key: string
  cert: string
  ca?: string
  passphrase?: string
  dhparam?: string
  ciphers?: string
  honorCipherOrder?: boolean
  secureProtocol?: string
}

export class HttpsServer {
  private config: HttpsConfig
  private httpsOptions: https.ServerOptions

  constructor() {
    this.config = this.loadConfig()
    this.httpsOptions = this.buildHttpsOptions()
  }

  private loadConfig(): HttpsConfig {
    // Production environment - load from environment variables
    if (process.env.NODE_ENV === 'production') {
      if (!process.env.SSL_KEY || !process.env.SSL_CERT) {
        throw new Error('SSL_KEY and SSL_CERT environment variables are required in production')
      }

      return {
        key: process.env.SSL_KEY,
        cert: process.env.SSL_CERT,
        ca: process.env.SSL_CA,
        passphrase: process.env.SSL_PASSPHRASE,
        dhparam: process.env.SSL_DHPARAM,
        ciphers: process.env.SSL_CIPHERS || this.getSecureCiphers(),
        honorCipherOrder: true,
        secureProtocol: 'TLSv1_2_method'
      }
    }

    // Development environment - load from files
    const certPath = path.join(__dirname, '../../certs')
    
    // Check if certificates exist
    const keyPath = path.join(certPath, 'server.key')
    const certFilePath = path.join(certPath, 'server.crt')
    
    if (!fs.existsSync(keyPath) || !fs.existsSync(certFilePath)) {
      console.warn('SSL certificates not found. HTTPS will not be available.')
      return {} as HttpsConfig
    }

    return {
      key: fs.readFileSync(keyPath, 'utf8'),
      cert: fs.readFileSync(certFilePath, 'utf8'),
      ciphers: this.getSecureCiphers(),
      honorCipherOrder: true
    }
  }

  private getSecureCiphers(): string {
    // Use secure cipher suites
    return [
      'ECDHE-RSA-AES128-GCM-SHA256',
      'ECDHE-ECDSA-AES128-GCM-SHA256',
      'ECDHE-RSA-AES256-GCM-SHA384',
      'ECDHE-ECDSA-AES256-GCM-SHA384',
      'DHE-RSA-AES128-GCM-SHA256',
      'DHE-DSS-AES128-GCM-SHA256',
      'kEDH+AESGCM',
      'ECDHE-RSA-AES128-SHA256',
      'ECDHE-ECDSA-AES128-SHA256',
      'ECDHE-RSA-AES128-SHA',
      'ECDHE-ECDSA-AES128-SHA',
      'ECDHE-RSA-AES256-SHA384',
      'ECDHE-ECDSA-AES256-SHA384',
      'ECDHE-RSA-AES256-SHA',
      'ECDHE-ECDSA-AES256-SHA',
      'DHE-RSA-AES128-SHA256',
      'DHE-RSA-AES128-SHA',
      'DHE-DSS-AES128-SHA256',
      'DHE-RSA-AES256-SHA256',
      'DHE-DSS-AES256-SHA',
      'DHE-RSA-AES256-SHA',
      '!aNULL',
      '!eNULL',
      '!EXPORT',
      '!DES',
      '!RC4',
      '!3DES',
      '!MD5',
      '!PSK'
    ].join(':')
  }

  private buildHttpsOptions(): https.ServerOptions {
    if (!this.config.key || !this.config.cert) {
      return {}
    }

    const options: https.ServerOptions = {
      key: this.config.key,
      cert: this.config.cert,
      ciphers: this.config.ciphers,
      honorCipherOrder: this.config.honorCipherOrder,
      secureProtocol: this.config.secureProtocol as any
    }

    if (this.config.ca) {
      options.ca = this.config.ca
    }

    if (this.config.passphrase) {
      options.passphrase = this.config.passphrase
    }

    if (this.config.dhparam) {
      options.dhparam = this.config.dhparam
    }

    // Additional security options
    options.secureOptions = 
      require('constants').SSL_OP_NO_SSLv2 |
      require('constants').SSL_OP_NO_SSLv3 |
      require('constants').SSL_OP_NO_TLSv1 |
      require('constants').SSL_OP_NO_TLSv1_1

    return options
  }

  isConfigured(): boolean {
    return !!(this.config.key && this.config.cert)
  }

  createServer(app: Application): https.Server | null {
    if (!this.isConfigured()) {
      return null
    }

    const server = https.createServer(this.httpsOptions, app)

    // Set secure headers
    server.on('request', (req, res) => {
      // HSTS header
      res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
      
      // Certificate transparency
      res.setHeader('Expect-CT', 'max-age=86400, enforce')
    })

    return server
  }

  // Generate self-signed certificate for development
  static async generateDevCertificate(): Promise<void> {
    const certPath = path.join(__dirname, '../../certs')
    
    // Create certs directory if it doesn't exist
    if (!fs.existsSync(certPath)) {
      fs.mkdirSync(certPath, { recursive: true })
    }

    const keyPath = path.join(certPath, 'server.key')
    const certFilePath = path.join(certPath, 'server.crt')

    // Check if certificates already exist
    if (fs.existsSync(keyPath) && fs.existsSync(certFilePath)) {
      console.log('Development certificates already exist')
      return
    }

    try {
      // Use OpenSSL to generate self-signed certificate
      const { execSync } = require('child_process')
      
      // Generate private key
      execSync(`openssl genrsa -out ${keyPath} 2048`)
      
      // Generate certificate
      execSync(`openssl req -new -x509 -key ${keyPath} -out ${certFilePath} -days 365 -subj "/C=JP/ST=Tokyo/L=Tokyo/O=Healthcare SaaS/OU=Development/CN=localhost"`)
      
      console.log('Development certificates generated successfully')
    } catch (error) {
      console.error('Failed to generate development certificates:', error)
      console.log('Please install OpenSSL or manually create certificates')
    }
  }
}

// Export singleton instance
export const httpsServer = new HttpsServer()