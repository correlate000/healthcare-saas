import { apiRequest, isApiError } from '@/lib/api'

// Mock fetch
global.fetch = jest.fn()

describe('API Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('apiRequest', () => {
    it('should make successful GET request', async () => {
      const mockResponse = { data: 'test' }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiRequest('/test')
      
      expect(fetch).toHaveBeenCalledWith('/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      expect(result).toEqual(mockResponse)
    })

    it('should make successful POST request with data', async () => {
      const mockResponse = { success: true }
      const postData = { name: 'test' }
      
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })

      const result = await apiRequest('/test', {
        method: 'POST',
        data: postData,
      })
      
      expect(fetch).toHaveBeenCalledWith('/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
      expect(result).toEqual(mockResponse)
    })

    it('should handle API errors', async () => {
      const errorResponse = { error: 'Not found' }
      ;(fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: async () => errorResponse,
      })

      await expect(apiRequest('/test')).rejects.toThrow('API request failed')
    })

    it('should handle network errors', async () => {
      ;(fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))

      await expect(apiRequest('/test')).rejects.toThrow('Network error')
    })
  })

  describe('isApiError', () => {
    it('should identify API error objects', () => {
      const apiError = { error: 'Test error', code: 400 }
      expect(isApiError(apiError)).toBe(true)
    })

    it('should not identify non-API error objects', () => {
      const regularObject = { message: 'Not an API error' }
      expect(isApiError(regularObject)).toBe(false)
      expect(isApiError(null)).toBe(false)
      expect(isApiError(undefined)).toBe(false)
      expect(isApiError('string')).toBe(false)
    })
  })
})