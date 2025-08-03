import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HealthForm } from '@/components/health/health-form'

// Mock the API
jest.mock('@/lib/api', () => ({
  apiRequest: jest.fn(),
}))

import { apiRequest } from '@/lib/api'

describe('HealthForm Component', () => {
  const mockOnSubmit = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders all form fields', () => {
    render(<HealthForm onSubmit={mockOnSubmit} />)
    
    expect(screen.getByLabelText(/収縮期血圧/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/拡張期血圧/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/心拍数/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/体重/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/身長/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/症状/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /記録を保存/i })).toBeInTheDocument()
  })

  it('validates required fields', async () => {
    const user = userEvent.setup()
    render(<HealthForm onSubmit={mockOnSubmit} />)
    
    const submitButton = screen.getByRole('button', { name: /記録を保存/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/収縮期血圧を入力してください/i)).toBeInTheDocument()
    })
  })

  it('validates blood pressure ranges', async () => {
    const user = userEvent.setup()
    render(<HealthForm onSubmit={mockOnSubmit} />)
    
    const systolicInput = screen.getByLabelText(/収縮期血圧/i)
    const diastolicInput = screen.getByLabelText(/拡張期血圧/i)
    
    await user.type(systolicInput, '300')
    await user.type(diastolicInput, '200')
    
    const submitButton = screen.getByRole('button', { name: /記録を保存/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/収縮期血圧は50-300の範囲で入力してください/i)).toBeInTheDocument()
    })
  })

  it('submits valid form data', async () => {
    const user = userEvent.setup()
    ;(apiRequest as jest.Mock).mockResolvedValue({ success: true })
    
    render(<HealthForm onSubmit={mockOnSubmit} />)
    
    // Fill in valid data
    await user.type(screen.getByLabelText(/収縮期血圧/i), '120')
    await user.type(screen.getByLabelText(/拡張期血圧/i), '80')
    await user.type(screen.getByLabelText(/心拍数/i), '72')
    await user.type(screen.getByLabelText(/体重/i), '70')
    await user.type(screen.getByLabelText(/身長/i), '175')
    await user.type(screen.getByLabelText(/症状/i), 'headache, fatigue')
    
    const submitButton = screen.getByRole('button', { name: /記録を保存/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        bloodPressure: { systolic: 120, diastolic: 80 },
        heartRate: 72,
        weight: 70,
        height: 175,
        symptoms: ['headache', 'fatigue']
      })
    })
  })

  it('handles API errors gracefully', async () => {
    const user = userEvent.setup()
    ;(apiRequest as jest.Mock).mockRejectedValue(new Error('API Error'))
    
    render(<HealthForm onSubmit={mockOnSubmit} />)
    
    // Fill minimal required data
    await user.type(screen.getByLabelText(/収縮期血圧/i), '120')
    await user.type(screen.getByLabelText(/拡張期血圧/i), '80')
    
    const submitButton = screen.getByRole('button', { name: /記録を保存/i })
    await user.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/エラーが発生しました/i)).toBeInTheDocument()
    })
  })

  it('disables submit button while loading', async () => {
    const user = userEvent.setup()
    ;(apiRequest as jest.Mock).mockImplementation(() => new Promise(resolve => setTimeout(resolve, 1000)))
    
    render(<HealthForm onSubmit={mockOnSubmit} />)
    
    // Fill minimal data
    await user.type(screen.getByLabelText(/収縮期血圧/i), '120')
    await user.type(screen.getByLabelText(/拡張期血圧/i), '80')
    
    const submitButton = screen.getByRole('button', { name: /記録を保存/i })
    await user.click(submitButton)
    
    expect(submitButton).toBeDisabled()
    expect(screen.getByText(/送信中/i)).toBeInTheDocument()
  })
})