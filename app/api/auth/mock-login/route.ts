import { NextResponse } from 'next/server'

// Mock login for development/demo purposes
export async function POST(request: Request) {
  const body = await request.json()
  const { email, password } = body

  // Mock user data
  const mockUser = {
    id: '1',
    email: email,
    name: 'テストユーザー',
    role: 'user' as const,
    permissions: ['read', 'write'],
    emailVerified: true,
    createdAt: new Date().toISOString()
  }

  // Simple validation
  if (email === 'test@example.com' && password === 'Test1234!') {
    return NextResponse.json({
      success: true,
      data: {
        user: mockUser,
        accessToken: 'mock-token-' + Date.now(),
        expiresIn: 3600
      }
    })
  }

  return NextResponse.json({
    success: false,
    message: 'Invalid credentials. Try: test@example.com / Test1234!'
  }, { status: 401 })
}