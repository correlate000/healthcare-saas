import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Mock current user endpoint
export async function GET() {
  // Check if user has a token (mock authentication)
  const cookieStore = cookies()
  const token = cookieStore.get('token')
  
  // For now, we'll check localStorage token on client side
  // In production, you'd verify the JWT token here
  
  // Return mock user if "authenticated"
  const mockUser = {
    id: '1',
    email: 'test@example.com',
    name: 'テストユーザー',
    role: 'user' as const,
    permissions: ['read', 'write'],
    emailVerified: true,
    createdAt: new Date().toISOString()
  }
  
  // For demo purposes, always return the mock user
  // In production, you'd validate the token first
  return NextResponse.json({
    success: true,
    data: mockUser
  })
}