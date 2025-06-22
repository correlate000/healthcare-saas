// End-to-End Encryption System
// Provides military-grade encryption for all sensitive data

import { 
  generateKeyPairSync, 
  publicEncrypt, 
  privateDecrypt,
  createCipheriv,
  createDecipheriv,
  randomBytes,
  createHash,
  createHmac,
  pbkdf2Sync,
  constants
} from 'crypto'

export interface EncryptionConfig {
  algorithm: 'aes-256-gcm' | 'aes-256-cbc' | 'chacha20-poly1305'
  keyDerivationIterations: number
  saltLength: number
  ivLength: number
  tagLength: number
  rsaKeySize: 2048 | 3072 | 4096
  hashAlgorithm: 'sha256' | 'sha384' | 'sha512'
}

export interface KeyPair {
  publicKey: string
  privateKey: string
  fingerprint: string
  createdAt: Date
  expiresAt: Date
}

export interface EncryptedMessage {
  id: string
  encryptedData: string
  encryptedKey: string
  iv: string
  authTag: string
  algorithm: string
  keyFingerprint: string
  timestamp: Date
  integrity: string
}

export interface SecureChannel {
  channelId: string
  participants: string[]
  sharedSecret: string
  createdAt: Date
  lastUsed: Date
  messageCount: number
  isActive: boolean
}

export interface EncryptionMetrics {
  totalMessages: number
  encryptionTime: number
  decryptionTime: number
  keyRotations: number
  failedDecryptions: number
  lastRotation: Date
}

class E2EEncryptionService {
  private readonly config: EncryptionConfig
  private readonly keyPairs: Map<string, KeyPair> = new Map()
  private readonly channels: Map<string, SecureChannel> = new Map()
  private readonly metrics: EncryptionMetrics

  constructor(config: EncryptionConfig) {
    this.config = config
    this.metrics = {
      totalMessages: 0,
      encryptionTime: 0,
      decryptionTime: 0,
      keyRotations: 0,
      failedDecryptions: 0,
      lastRotation: new Date()
    }
  }

  // Generate RSA key pair for a user/entity
  async generateKeyPair(entityId: string, expirationDays: number = 365): Promise<KeyPair> {
    const startTime = performance.now()
    
    const { publicKey, privateKey } = generateKeyPairSync('rsa', {
      modulusLength: this.config.rsaKeySize,
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem'
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem'
      }
    })

    const fingerprint = this.generateFingerprint(publicKey)
    const expiresAt = new Date(Date.now() + (expirationDays * 24 * 60 * 60 * 1000))

    const keyPair: KeyPair = {
      publicKey,
      privateKey,
      fingerprint,
      createdAt: new Date(),
      expiresAt
    }

    this.keyPairs.set(entityId, keyPair)
    this.metrics.keyRotations++
    this.metrics.lastRotation = new Date()

    const duration = performance.now() - startTime
    console.log(`Generated key pair for ${entityId} in ${duration.toFixed(2)}ms`)

    return keyPair
  }

  // Generate fingerprint for public key
  private generateFingerprint(publicKey: string): string {
    return createHash(this.config.hashAlgorithm)
      .update(publicKey)
      .digest('hex')
      .substring(0, 32)
  }

  // Encrypt data using hybrid encryption (RSA + AES)
  async encryptMessage(
    data: string, 
    recipientEntityId: string, 
    senderEntityId?: string
  ): Promise<EncryptedMessage> {
    const startTime = performance.now()
    
    const recipientKeyPair = this.keyPairs.get(recipientEntityId)
    if (!recipientKeyPair) {
      throw new Error('Recipient public key not found')
    }

    // Check key expiration
    if (recipientKeyPair.expiresAt < new Date()) {
      throw new Error('Recipient key has expired')
    }

    // Generate symmetric key and IV
    const symmetricKey = randomBytes(32) // 256-bit key
    const iv = randomBytes(this.config.ivLength)
    
    // Encrypt data with AES
    const cipher = createCipheriv(this.config.algorithm, symmetricKey, iv)
    let encryptedData = cipher.update(data, 'utf8', 'hex')
    encryptedData += cipher.final('hex')
    
    // Get authentication tag for GCM mode
    const authTag = this.config.algorithm.includes('gcm') ? 
      cipher.getAuthTag().toString('hex') : 
      this.generateHMAC(encryptedData, symmetricKey)

    // Encrypt symmetric key with recipient's public key
    const encryptedKey = publicEncrypt(
      {
        key: recipientKeyPair.publicKey,
        padding: constants.RSA_PKCS1_OAEP_PADDING,
        oaepHash: this.config.hashAlgorithm
      },
      symmetricKey
    ).toString('hex')

    const message: EncryptedMessage = {
      id: randomBytes(16).toString('hex'),
      encryptedData,
      encryptedKey,
      iv: iv.toString('hex'),
      authTag,
      algorithm: this.config.algorithm,
      keyFingerprint: recipientKeyPair.fingerprint,
      timestamp: new Date(),
      integrity: '' // Will be set below
    }

    // Generate integrity hash
    message.integrity = this.generateIntegrityHash(message)

    this.metrics.totalMessages++
    this.metrics.encryptionTime += performance.now() - startTime

    console.log(`Encrypted message ${message.id} for ${recipientEntityId}`)
    return message
  }

  // Decrypt message
  async decryptMessage(
    encryptedMessage: EncryptedMessage, 
    recipientEntityId: string
  ): Promise<string> {
    const startTime = performance.now()
    
    try {
      // Verify message integrity
      if (!this.verifyIntegrity(encryptedMessage)) {
        throw new Error('Message integrity verification failed')
      }

      const keyPair = this.keyPairs.get(recipientEntityId)
      if (!keyPair) {
        throw new Error('Private key not found')
      }

      // Check if this message is for this recipient
      if (encryptedMessage.keyFingerprint !== keyPair.fingerprint) {
        throw new Error('Message not intended for this recipient')
      }

      // Decrypt symmetric key with private key
      const symmetricKey = privateDecrypt(
        {
          key: keyPair.privateKey,
          padding: constants.RSA_PKCS1_OAEP_PADDING,
          oaepHash: this.config.hashAlgorithm
        },
        Buffer.from(encryptedMessage.encryptedKey, 'hex')
      )

      // Decrypt data with AES
      const decipher = createDecipheriv(
        encryptedMessage.algorithm,
        symmetricKey,
        Buffer.from(encryptedMessage.iv, 'hex')
      )

      // Set auth tag for GCM mode
      if (encryptedMessage.algorithm.includes('gcm')) {
        decipher.setAuthTag(Buffer.from(encryptedMessage.authTag, 'hex'))
      } else {
        // Verify HMAC for non-GCM modes
        const expectedHMAC = this.generateHMAC(encryptedMessage.encryptedData, symmetricKey)
        if (expectedHMAC !== encryptedMessage.authTag) {
          throw new Error('Message authentication failed')
        }
      }

      let decryptedData = decipher.update(encryptedMessage.encryptedData, 'hex', 'utf8')
      decryptedData += decipher.final('utf8')

      this.metrics.decryptionTime += performance.now() - startTime
      console.log(`Decrypted message ${encryptedMessage.id}`)
      
      return decryptedData

    } catch (error) {
      this.metrics.failedDecryptions++
      throw new Error(`Decryption failed: ${error.message}`)
    }
  }

  // Generate HMAC for authentication
  private generateHMAC(data: string, key: Buffer): string {
    return createHmac(this.config.hashAlgorithm, key)
      .update(data)
      .digest('hex')
  }

  // Generate integrity hash for message
  private generateIntegrityHash(message: Omit<EncryptedMessage, 'integrity'>): string {
    const payload = JSON.stringify({
      encryptedData: message.encryptedData,
      encryptedKey: message.encryptedKey,
      iv: message.iv,
      authTag: message.authTag,
      algorithm: message.algorithm,
      keyFingerprint: message.keyFingerprint,
      timestamp: message.timestamp.toISOString()
    })
    
    return createHash(this.config.hashAlgorithm).update(payload).digest('hex')
  }

  // Verify message integrity
  private verifyIntegrity(message: EncryptedMessage): boolean {
    const calculatedHash = this.generateIntegrityHash(message)
    return calculatedHash === message.integrity
  }

  // Create secure channel for group communication
  async createSecureChannel(participants: string[], channelId?: string): Promise<SecureChannel> {
    const id = channelId || randomBytes(16).toString('hex')
    
    // Generate shared secret using key derivation
    const sharedSecret = await this.deriveSharedSecret(participants)
    
    const channel: SecureChannel = {
      channelId: id,
      participants: [...participants],
      sharedSecret,
      createdAt: new Date(),
      lastUsed: new Date(),
      messageCount: 0,
      isActive: true
    }

    this.channels.set(id, channel)
    console.log(`Created secure channel ${id} with ${participants.length} participants`)
    
    return channel
  }

  // Derive shared secret for group communication
  private async deriveSharedSecret(participants: string[]): Promise<string> {
    // In production, implement proper key exchange protocol (e.g., Diffie-Hellman)
    const combinedSeed = participants.sort().join('|')
    const salt = randomBytes(32)
    
    return pbkdf2Sync(
      combinedSeed,
      salt,
      this.config.keyDerivationIterations,
      32,
      this.config.hashAlgorithm
    ).toString('hex')
  }

  // Encrypt message for secure channel
  async encryptChannelMessage(
    data: string, 
    channelId: string, 
    senderId: string
  ): Promise<EncryptedMessage> {
    const channel = this.channels.get(channelId)
    if (!channel || !channel.isActive) {
      throw new Error('Channel not found or inactive')
    }

    if (!channel.participants.includes(senderId)) {
      throw new Error('Sender not authorized for this channel')
    }

    // Use channel's shared secret for encryption
    const key = Buffer.from(channel.sharedSecret, 'hex')
    const iv = randomBytes(this.config.ivLength)
    
    const cipher = createCipheriv(this.config.algorithm, key, iv)
    let encryptedData = cipher.update(data, 'utf8', 'hex')
    encryptedData += cipher.final('hex')
    
    const authTag = this.config.algorithm.includes('gcm') ? 
      cipher.getAuthTag().toString('hex') : 
      this.generateHMAC(encryptedData, key)

    const message: EncryptedMessage = {
      id: randomBytes(16).toString('hex'),
      encryptedData,
      encryptedKey: '', // Not used for channel messages
      iv: iv.toString('hex'),
      authTag,
      algorithm: this.config.algorithm,
      keyFingerprint: channelId,
      timestamp: new Date(),
      integrity: ''
    }

    message.integrity = this.generateIntegrityHash(message)

    // Update channel stats
    channel.lastUsed = new Date()
    channel.messageCount++

    return message
  }

  // Decrypt channel message
  async decryptChannelMessage(
    encryptedMessage: EncryptedMessage, 
    channelId: string, 
    recipientId: string
  ): Promise<string> {
    const channel = this.channels.get(channelId)
    if (!channel) {
      throw new Error('Channel not found')
    }

    if (!channel.participants.includes(recipientId)) {
      throw new Error('Recipient not authorized for this channel')
    }

    // Verify message is for this channel
    if (encryptedMessage.keyFingerprint !== channelId) {
      throw new Error('Message not for this channel')
    }

    if (!this.verifyIntegrity(encryptedMessage)) {
      throw new Error('Channel message integrity verification failed')
    }

    const key = Buffer.from(channel.sharedSecret, 'hex')
    
    const decipher = createDecipheriv(
      encryptedMessage.algorithm,
      key,
      Buffer.from(encryptedMessage.iv, 'hex')
    )

    if (encryptedMessage.algorithm.includes('gcm')) {
      decipher.setAuthTag(Buffer.from(encryptedMessage.authTag, 'hex'))
    } else {
      const expectedHMAC = this.generateHMAC(encryptedMessage.encryptedData, key)
      if (expectedHMAC !== encryptedMessage.authTag) {
        throw new Error('Channel message authentication failed')
      }
    }

    let decryptedData = decipher.update(encryptedMessage.encryptedData, 'hex', 'utf8')
    decryptedData += decipher.final('utf8')

    return decryptedData
  }

  // Rotate keys for enhanced security
  async rotateKeys(entityId: string): Promise<KeyPair> {
    console.log(`Rotating keys for ${entityId}`)
    return this.generateKeyPair(entityId)
  }

  // Get public key for an entity
  getPublicKey(entityId: string): string | null {
    const keyPair = this.keyPairs.get(entityId)
    return keyPair?.publicKey || null
  }

  // Verify key fingerprint
  verifyFingerprint(entityId: string, expectedFingerprint: string): boolean {
    const keyPair = this.keyPairs.get(entityId)
    return keyPair?.fingerprint === expectedFingerprint
  }

  // Get encryption metrics
  getMetrics(): EncryptionMetrics {
    return { ...this.metrics }
  }

  // Export public keys for key exchange
  exportPublicKeys(): Record<string, string> {
    const publicKeys: Record<string, string> = {}
    
    this.keyPairs.forEach((keyPair, entityId) => {
      publicKeys[entityId] = keyPair.publicKey
    })
    
    return publicKeys
  }

  // Import public key for external entity
  importPublicKey(entityId: string, publicKey: string, expirationDays: number = 365): void {
    const fingerprint = this.generateFingerprint(publicKey)
    const expiresAt = new Date(Date.now() + (expirationDays * 24 * 60 * 60 * 1000))

    const keyPair: KeyPair = {
      publicKey,
      privateKey: '', // No private key for external entities
      fingerprint,
      createdAt: new Date(),
      expiresAt
    }

    this.keyPairs.set(entityId, keyPair)
    console.log(`Imported public key for external entity ${entityId}`)
  }

  // Clean up expired keys
  async cleanupExpiredKeys(): Promise<void> {
    const now = new Date()
    const expiredKeys: string[] = []

    this.keyPairs.forEach((keyPair, entityId) => {
      if (keyPair.expiresAt < now) {
        expiredKeys.push(entityId)
      }
    })

    expiredKeys.forEach(entityId => {
      this.keyPairs.delete(entityId)
      console.log(`Removed expired key for ${entityId}`)
    })

    console.log(`Cleaned up ${expiredKeys.length} expired keys`)
  }

  // Deactivate secure channel
  async deactivateChannel(channelId: string): Promise<void> {
    const channel = this.channels.get(channelId)
    if (channel) {
      channel.isActive = false
      console.log(`Deactivated secure channel ${channelId}`)
    }
  }

  // Generate key exchange QR code data
  generateKeyExchangeData(entityId: string): string {
    const keyPair = this.keyPairs.get(entityId)
    if (!keyPair) {
      throw new Error('Key pair not found')
    }

    const exchangeData = {
      entityId,
      publicKey: keyPair.publicKey,
      fingerprint: keyPair.fingerprint,
      timestamp: new Date().toISOString()
    }

    return Buffer.from(JSON.stringify(exchangeData)).toString('base64')
  }
}

export { 
  E2EEncryptionService,
  type EncryptionConfig,
  type KeyPair,
  type EncryptedMessage,
  type SecureChannel,
  type EncryptionMetrics
}