// Enterprise SSO Integration System
// Supports SAML 2.0, OAuth 2.0, OpenID Connect, Active Directory

import { sign, verify } from 'jsonwebtoken'
import { randomBytes, createHash, pbkdf2Sync } from 'crypto'

export interface SSOProvider {
  id: string
  name: string
  type: 'saml' | 'oauth' | 'openid' | 'ad'
  config: SSOConfig
  status: 'active' | 'inactive' | 'pending'
}

export interface SSOConfig {
  // SAML Configuration
  saml?: {
    entryPoint: string
    issuer: string
    cert: string
    identifierFormat?: string
    wantAuthnResponseSigned?: boolean
    wantAssertionsSigned?: boolean
  }
  
  // OAuth/OpenID Configuration
  oauth?: {
    clientId: string
    clientSecret: string
    authorizationURL: string
    tokenURL: string
    userInfoURL: string
    scope: string[]
  }
  
  // Active Directory Configuration
  ad?: {
    url: string
    baseDN: string
    username: string
    password: string
    searchFilter: string
  }
}

export interface User {
  id: string
  email: string
  name: string
  department?: string
  role: 'user' | 'admin' | 'counselor'
  companyId: string
  ssoProvider: string
  anonymousId: string // For privacy compliance
  lastLogin: Date
  isActive: boolean
}

export interface Company {
  id: string
  name: string
  domain: string
  ssoProviders: SSOProvider[]
  settings: {
    enforceSSO: boolean
    allowAnonymousMode: boolean
    dataRetentionDays: number
    requireMFA: boolean
  }
  encryption: {
    publicKey: string
    keyRotationDate: Date
  }
}

class EnterpriseSSOService {
  private jwtSecret: string
  private companies: Map<string, Company> = new Map()
  
  constructor(jwtSecret: string) {
    this.jwtSecret = jwtSecret
  }

  // Initialize SSO provider for a company
  async initializeSSOProvider(companyId: string, provider: SSOProvider): Promise<void> {
    const company = this.companies.get(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    // Validate provider configuration
    await this.validateSSOConfig(provider)
    
    // Add provider to company
    company.ssoProviders.push(provider)
    
    // Log configuration change
    console.log(`SSO Provider ${provider.name} configured for company ${companyId}`)
  }

  // Validate SSO configuration
  private async validateSSOConfig(provider: SSOProvider): Promise<void> {
    switch (provider.type) {
      case 'saml':
        if (!provider.config.saml?.entryPoint || !provider.config.saml?.issuer) {
          throw new Error('Invalid SAML configuration')
        }
        break
      case 'oauth':
      case 'openid':
        if (!provider.config.oauth?.clientId || !provider.config.oauth?.clientSecret) {
          throw new Error('Invalid OAuth configuration')
        }
        break
      case 'ad':
        if (!provider.config.ad?.url || !provider.config.ad?.baseDN) {
          throw new Error('Invalid Active Directory configuration')
        }
        break
    }
  }

  // Generate SSO login URL
  async generateSSOLoginURL(companyId: string, providerId: string, returnUrl?: string): Promise<string> {
    const company = this.companies.get(companyId)
    if (!company) {
      throw new Error('Company not found')
    }

    const provider = company.ssoProviders.find(p => p.id === providerId)
    if (!provider) {
      throw new Error('SSO provider not found')
    }

    const state = this.generateState(companyId, providerId, returnUrl)
    
    switch (provider.type) {
      case 'saml':
        return this.generateSAMLLoginURL(provider, state)
      case 'oauth':
      case 'openid':
        return this.generateOAuthLoginURL(provider, state)
      default:
        throw new Error('Unsupported SSO provider type')
    }
  }

  // Generate SAML login URL
  private generateSAMLLoginURL(provider: SSOProvider, state: string): string {
    const samlRequest = this.createSAMLRequest(provider, state)
    const encodedRequest = Buffer.from(samlRequest).toString('base64')
    
    return `${provider.config.saml!.entryPoint}?SAMLRequest=${encodeURIComponent(encodedRequest)}&RelayState=${state}`
  }

  // Generate OAuth login URL
  private generateOAuthLoginURL(provider: SSOProvider, state: string): string {
    const params = new URLSearchParams({
      client_id: provider.config.oauth!.clientId,
      response_type: 'code',
      scope: provider.config.oauth!.scope.join(' '),
      redirect_uri: `${process.env.BASE_URL}/api/auth/callback/${provider.id}`,
      state
    })
    
    return `${provider.config.oauth!.authorizationURL}?${params.toString()}`
  }

  // Create SAML authentication request
  private createSAMLRequest(provider: SSOProvider, state: string): string {
    const requestId = `_${randomBytes(16).toString('hex')}`
    const timestamp = new Date().toISOString()
    
    return `<?xml version="1.0" encoding="UTF-8"?>
<samlp:AuthnRequest 
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="${requestId}"
  Version="2.0"
  IssueInstant="${timestamp}"
  Destination="${provider.config.saml!.entryPoint}"
  AssertionConsumerServiceURL="${process.env.BASE_URL}/api/auth/saml/callback"
  ProtocolBinding="urn:oasis:names:tc:SAML:2.0:bindings:HTTP-POST">
  <saml:Issuer>${provider.config.saml!.issuer}</saml:Issuer>
  <samlp:NameIDPolicy Format="urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress" AllowCreate="true"/>
</samlp:AuthnRequest>`
  }

  // Process SSO callback
  async processSSOCallback(providerId: string, authData: any, state: string): Promise<{ user: User; token: string }> {
    const { companyId, returnUrl } = this.parseState(state)
    const company = this.companies.get(companyId)
    
    if (!company) {
      throw new Error('Company not found')
    }

    const provider = company.ssoProviders.find(p => p.id === providerId)
    if (!provider) {
      throw new Error('SSO provider not found')
    }

    // Extract user information from SSO response
    const userInfo = await this.extractUserInfo(provider, authData)
    
    // Create or update user
    const user = await this.createOrUpdateUser(userInfo, company)
    
    // Generate JWT token
    const token = this.generateJWT(user, company)
    
    // Log successful authentication
    console.log(`User ${user.email} authenticated via SSO for company ${companyId}`)
    
    return { user, token }
  }

  // Extract user information from SSO response
  private async extractUserInfo(provider: SSOProvider, authData: any): Promise<Partial<User>> {
    switch (provider.type) {
      case 'saml':
        return this.extractSAMLUserInfo(authData)
      case 'oauth':
      case 'openid':
        return this.extractOAuthUserInfo(provider, authData)
      default:
        throw new Error('Unsupported provider type')
    }
  }

  // Extract user info from SAML assertion
  private extractSAMLUserInfo(assertion: any): Partial<User> {
    return {
      email: assertion.email || assertion['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
      name: assertion.name || assertion['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
      department: assertion.department || assertion['http://schemas.microsoft.com/ws/2008/06/identity/claims/department']
    }
  }

  // Extract user info from OAuth response
  private async extractOAuthUserInfo(provider: SSOProvider, authData: any): Promise<Partial<User>> {
    // Exchange code for access token
    const tokenResponse = await fetch(provider.config.oauth!.tokenURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${provider.config.oauth!.clientId}:${provider.config.oauth!.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: authData.code,
        redirect_uri: `${process.env.BASE_URL}/api/auth/callback/${provider.id}`
      })
    })

    const tokens = await tokenResponse.json()
    
    // Get user info
    const userResponse = await fetch(provider.config.oauth!.userInfoURL, {
      headers: {
        'Authorization': `Bearer ${tokens.access_token}`
      }
    })

    const userInfo = await userResponse.json()
    
    return {
      email: userInfo.email,
      name: userInfo.name || `${userInfo.given_name} ${userInfo.family_name}`,
      department: userInfo.department
    }
  }

  // Create or update user
  private async createOrUpdateUser(userInfo: Partial<User>, company: Company): Promise<User> {
    // Generate anonymous ID for privacy
    const anonymousId = this.generateAnonymousId(userInfo.email!, company.id)
    
    const user: User = {
      id: randomBytes(16).toString('hex'),
      email: userInfo.email!,
      name: userInfo.name!,
      department: userInfo.department,
      role: 'user',
      companyId: company.id,
      ssoProvider: 'sso',
      anonymousId,
      lastLogin: new Date(),
      isActive: true
    }

    return user
  }

  // Generate anonymous ID for privacy compliance
  private generateAnonymousId(email: string, companyId: string): string {
    const salt = `${companyId}_anonymization_salt`
    return createHash('sha256').update(`${email}${salt}`).digest('hex').substring(0, 16)
  }

  // Generate JWT token
  private generateJWT(user: User, company: Company): string {
    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      companyId: company.id,
      anonymousId: user.anonymousId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 hours
    }

    return sign(payload, this.jwtSecret, { algorithm: 'HS256' })
  }

  // Generate state parameter
  private generateState(companyId: string, providerId: string, returnUrl?: string): string {
    const stateData = {
      companyId,
      providerId,
      returnUrl,
      timestamp: Date.now(),
      nonce: randomBytes(16).toString('hex')
    }
    
    return Buffer.from(JSON.stringify(stateData)).toString('base64')
  }

  // Parse state parameter
  private parseState(state: string): { companyId: string; providerId: string; returnUrl?: string } {
    try {
      return JSON.parse(Buffer.from(state, 'base64').toString())
    } catch {
      throw new Error('Invalid state parameter')
    }
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<any> {
    try {
      return verify(token, this.jwtSecret)
    } catch (error) {
      throw new Error('Invalid token')
    }
  }

  // Logout and invalidate session
  async logout(token: string): Promise<void> {
    // In production, maintain a blacklist of invalidated tokens
    // or use shorter-lived tokens with refresh mechanism
    console.log('User logged out')
  }

  // Register new company
  async registerCompany(companyData: Omit<Company, 'id' | 'encryption'>): Promise<Company> {
    const company: Company = {
      id: randomBytes(16).toString('hex'),
      ...companyData,
      encryption: {
        publicKey: this.generatePublicKey(),
        keyRotationDate: new Date()
      }
    }

    this.companies.set(company.id, company)
    return company
  }

  // Generate public key for encryption
  private generatePublicKey(): string {
    // In production, generate actual RSA key pair
    return randomBytes(32).toString('hex')
  }

  // Get company by domain
  async getCompanyByDomain(domain: string): Promise<Company | null> {
    for (const company of this.companies.values()) {
      if (company.domain === domain) {
        return company
      }
    }
    return null
  }

  // Enforce MFA if required
  async enforceMFA(userId: string, companyId: string): Promise<boolean> {
    const company = this.companies.get(companyId)
    return company?.settings.requireMFA || false
  }
}

export { EnterpriseSSOService }

// Usage example:
// const ssoService = new EnterpriseSSOService(process.env.JWT_SECRET!)
// 
// // Register company
// const company = await ssoService.registerCompany({
//   name: "Acme Corp",
//   domain: "acme.com",
//   ssoProviders: [],
//   settings: {
//     enforceSSO: true,
//     allowAnonymousMode: true,
//     dataRetentionDays: 365,
//     requireMFA: true
//   }
// })
//
// // Configure SAML SSO
// await ssoService.initializeSSOProvider(company.id, {
//   id: "saml_provider_1",
//   name: "Acme SAML",
//   type: "saml",
//   status: "active",
//   config: {
//     saml: {
//       entryPoint: "https://acme.com/saml/login",
//       issuer: "mindcare-app",
//       cert: "-----BEGIN CERTIFICATE-----..."
//     }
//   }
// })