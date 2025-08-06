import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthProvider, useAuth } from '@/contexts/auth-context'

// Mock the API
jest.mock('@/lib/api', () => ({
  apiRequest: jest.fn(),
}))

import { apiRequest } from '@/lib/api'

// Test component to interact with AuthContext
const TestComponent = () => {
  const { user, login, logout, loading, error } = useAuth()
  
  return (
    <div>
      <div data-testid="user-status">
        {loading ? 'Loading...' : user ? `Logged in as ${user.email}` : 'Not logged in'}
      </div>
      {error && <div data-testid="error">{error}</div>}
      <button onClick={() => login('test@example.com', 'password')}>
        Login
      </button>
      <button onClick={logout}>
        Logout
      </button>
    </div>
  )
}

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    localStorage.clear()
  })

  it('provides initial unauthenticated state', () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in')
  })

  it('handles successful login', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User',
      role: 'user' as const
    }
    
    ;(apiRequest as jest.Mock).mockResolvedValue({
      user: mockUser,
      token: 'fake-token'
    })
    
    const user = userEvent.setup()
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    const loginButton = screen.getByRole('button', { name: /login/i })
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com')
    })
    
    expect(localStorage.getItem('token')).toBe('fake-token')
  })

  it.skip('handles login failure', async () => {
    const errorMessage = 'Invalid credentials'
    const rejectedPromise = Promise.reject(new Error(errorMessage))
    ;(apiRequest as jest.Mock).mockReturnValue(rejectedPromise)
    
    const user = userEvent.setup()
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    const loginButton = screen.getByRole('button', { name: /login/i })
    await user.click(loginButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('error')).toHaveTextContent(errorMessage)
    })
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in')
  })

  it('handles logout', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com', 
      name: 'Test User',
      role: 'user' as const
    }
    
    // Set up initial logged in state
    localStorage.setItem('token', 'fake-token')
    ;(apiRequest as jest.Mock).mockResolvedValue({ user: mockUser })
    
    const user = userEvent.setup()
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    // Wait for initial auth check
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com')
    })
    
    const logoutButton = screen.getByRole('button', { name: /logout/i })
    await user.click(logoutButton)
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in')
    })
    
    expect(localStorage.getItem('token')).toBeNull()
  })

  it('shows loading state during authentication', async () => {
    localStorage.setItem('token', 'test-token')
    ;(apiRequest as jest.Mock).mockImplementation(() => 
      new Promise(resolve => setTimeout(() => resolve({ user: null }), 100))
    )
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    expect(screen.getByTestId('user-status')).toHaveTextContent('Loading...')
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Not logged in')
    })
  })

  it('restores user session from localStorage', async () => {
    const mockUser = {
      id: '1',
      email: 'test@example.com',
      name: 'Test User', 
      role: 'user' as const
    }
    
    localStorage.setItem('token', 'stored-token')
    ;(apiRequest as jest.Mock).mockResolvedValue({ user: mockUser })
    
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    )
    
    await waitFor(() => {
      expect(screen.getByTestId('user-status')).toHaveTextContent('Logged in as test@example.com')
    })
    
    expect(apiRequest).toHaveBeenCalledWith('/auth/verify', {
      headers: { Authorization: 'Bearer stored-token' }
    })
  })
})