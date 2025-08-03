import { test, expect } from '@playwright/test'

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => {
    // Mock authentication
    await page.route('**/api/auth/verify', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'user'
          }
        })
      })
    })

    // Mock health data
    await page.route('**/api/health-data', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: '1',
            date: '2025-08-01',
            bloodPressure: { systolic: 120, diastolic: 80 },
            heartRate: 72,
            weight: 70.5,
            symptoms: ['headache']
          },
          {
            id: '2',
            date: '2025-08-02',
            bloodPressure: { systolic: 118, diastolic: 78 },
            heartRate: 68,
            weight: 70.3,
            symptoms: []
          }
        ])
      })
    })

    // Set authentication token
    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token')
    })

    await page.goto('/dashboard')
  })

  test('should display dashboard layout', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /ダッシュボード/i })).toBeVisible()
    await expect(page.getByText(/Health Overview/i)).toBeVisible()
  })

  test('should show user greeting', async ({ page }) => {
    await expect(page.getByText(/Test User/i)).toBeVisible()
    await expect(page.getByText(/さん、おかえりなさい/i)).toBeVisible()
  })

  test('should display health metrics cards', async ({ page }) => {
    await expect(page.getByText(/血圧/i)).toBeVisible()
    await expect(page.getByText(/120\/80/i)).toBeVisible()
    
    await expect(page.getByText(/心拍数/i)).toBeVisible()
    await expect(page.getByText(/72 BPM/i)).toBeVisible()
    
    await expect(page.getByText(/体重/i)).toBeVisible()
    await expect(page.getByText(/70.5 kg/i)).toBeVisible()
  })

  test('should display health trend chart', async ({ page }) => {
    await expect(page.getByText(/健康指標の推移/i)).toBeVisible()
    
    // Wait for chart to load
    await page.waitForSelector('[data-testid="health-chart"]', { timeout: 5000 })
    
    // Chart should be visible
    const chart = page.locator('[data-testid="health-chart"]')
    await expect(chart).toBeVisible()
  })

  test('should show recent health records', async ({ page }) => {
    await expect(page.getByText(/最近の記録/i)).toBeVisible()
    
    // Should show recent entries
    await expect(page.getByText(/2025-08-02/i)).toBeVisible()
    await expect(page.getByText(/2025-08-01/i)).toBeVisible()
    
    // Should show headache symptom
    await expect(page.getByText(/headache/i)).toBeVisible()
  })

  test('should navigate to health form', async ({ page }) => {
    await page.getByRole('button', { name: /新しい記録を追加/i }).click()
    
    await expect(page).toHaveURL(/.*\/health\/record/)
  })

  test('should show health status indicators', async ({ page }) => {
    // Normal blood pressure should show green indicator
    const bpIndicator = page.locator('[data-testid="bp-status"]')
    await expect(bpIndicator).toHaveClass(/text-green/)
    
    // Normal heart rate should show green indicator
    const hrIndicator = page.locator('[data-testid="hr-status"]')
    await expect(hrIndicator).toHaveClass(/text-green/)
  })

  test('should handle empty health data', async ({ page }) => {
    // Mock empty health data response
    await page.route('**/api/health-data', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      })
    })

    await page.reload()
    
    await expect(page.getByText(/健康データがありません/i)).toBeVisible()
    await expect(page.getByText(/最初の記録を追加してください/i)).toBeVisible()
  })

  test('should show AI health insights', async ({ page }) => {
    await expect(page.getByText(/AI健康アドバイス/i)).toBeVisible()
    
    // Mock AI insights
    await page.route('**/api/ai/insights', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          insights: [
            '血圧が安定しています。この調子を保ちましょう。',
            '心拍数は正常範囲内です。',
            '体重の変動も健康的な範囲内です。'
          ],
          riskLevel: 'low'
        })
      })
    })

    await page.getByRole('button', { name: /AI分析を更新/i }).click()
    
    await expect(page.getByText(/血圧が安定しています/i)).toBeVisible()
    await expect(page.getByText(/心拍数は正常範囲内です/i)).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Should still show main dashboard elements
    await expect(page.getByRole('heading', { name: /ダッシュボード/i })).toBeVisible()
    await expect(page.getByText(/Health Overview/i)).toBeVisible()
    
    // Metrics should stack vertically on mobile
    const metricsContainer = page.locator('[data-testid="metrics-container"]')
    await expect(metricsContainer).toHaveClass(/flex-col/)
  })

  test('should handle logout', async ({ page }) => {
    await page.getByRole('button', { name: /ログアウト/i }).click()
    
    await expect(page).toHaveURL(/.*\/auth/)
    
    // Should clear authentication token
    const token = await page.evaluate(() => localStorage.getItem('token'))
    expect(token).toBeNull()
  })
})