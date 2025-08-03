import { setupServer } from 'msw/node'
import { http, HttpResponse } from 'msw'

// Define handlers for mocking API responses
export const handlers = [
  // Authentication endpoints
  http.post('/api/auth/login', () => {
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      },
      token: 'fake-jwt-token'
    })
  }),

  http.post('/api/auth/register', () => {
    return HttpResponse.json({
      user: {
        id: '2',
        email: 'newuser@example.com',
        name: 'New User',
        role: 'user'
      },
      token: 'fake-jwt-token'
    })
  }),

  http.get('/api/auth/verify', ({ request }) => {
    const authHeader = request.headers.get('Authorization')
    if (!authHeader || !authHeader.includes('Bearer')) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    return HttpResponse.json({
      user: {
        id: '1',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
      }
    })
  }),

  // Health data endpoints
  http.get('/api/health-data', () => {
    return HttpResponse.json([
      {
        id: '1',
        date: '2025-08-01',
        bloodPressure: { systolic: 120, diastolic: 80 },
        heartRate: 72,
        weight: 70.5,
        height: 175,
        symptoms: ['headache']
      },
      {
        id: '2',
        date: '2025-08-02',
        bloodPressure: { systolic: 118, diastolic: 78 },
        heartRate: 68,
        weight: 70.3,
        height: 175,
        symptoms: []
      }
    ])
  }),

  http.post('/api/health-data', async ({ request }) => {
    const data = await request.json()
    return HttpResponse.json({
      id: 'new-record-id',
      ...data,
      date: new Date().toISOString().split('T')[0]
    }, { status: 201 })
  }),

  http.get('/api/health-data/:id', ({ params }) => {
    return HttpResponse.json({
      id: params.id,
      date: '2025-08-01',
      bloodPressure: { systolic: 120, diastolic: 80 },
      heartRate: 72,
      weight: 70.5,
      height: 175,
      symptoms: ['headache']
    })
  }),

  // AI analysis endpoints
  http.post('/api/ai/analyze', () => {
    return HttpResponse.json({
      insights: [
        '血圧が安定しています。この調子を保ちましょう。',
        '心拍数は正常範囲内です。',
        '体重の変動も健康的な範囲内です。'
      ],
      riskLevel: 'low',
      recommendations: [
        '定期的な運動を続けてください',
        'バランスの取れた食事を心がけてください'
      ]
    })
  }),

  http.get('/api/ai/insights', () => {
    return HttpResponse.json({
      insights: [
        '血圧が安定しています。この調子を保ちましょう。',
        '心拍数は正常範囲内です。'
      ],
      riskLevel: 'low'
    })
  }),

  // File upload endpoints
  http.post('/api/files/upload', () => {
    return HttpResponse.json({
      fileId: 'uploaded-file-id',
      filename: 'test-file.pdf',
      url: '/uploads/test-file.pdf'
    })
  }),

  // Health endpoint
  http.get('/api/health', () => {
    return HttpResponse.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      service: 'healthcare-saas-frontend',
      version: '1.0.0'
    })
  }),
]

// Setup MSW server
export const server = setupServer(...handlers)

// Server event listeners
export const setupTestServer = () => {
  // Start server before all tests
  beforeAll(() => {
    server.listen({
      onUnhandledRequest: 'warn'
    })
  })

  // Reset handlers after each test
  afterEach(() => {
    server.resetHandlers()
  })

  // Clean up after all tests
  afterAll(() => {
    server.close()
  })
}