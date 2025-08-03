import { test, expect } from '@playwright/test'

test.describe('Health Form', () => {
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

    await page.addInitScript(() => {
      localStorage.setItem('token', 'fake-jwt-token')
    })

    await page.goto('/health/record')
  })

  test('should display health form', async ({ page }) => {
    await expect(page.getByRole('heading', { name: /健康データの記録/i })).toBeVisible()
    
    // Check all form fields are present
    await expect(page.getByLabel(/収縮期血圧/i)).toBeVisible()
    await expect(page.getByLabel(/拡張期血圧/i)).toBeVisible()
    await expect(page.getByLabel(/心拍数/i)).toBeVisible()
    await expect(page.getByLabel(/体重/i)).toBeVisible()
    await expect(page.getByLabel(/身長/i)).toBeVisible()
    await expect(page.getByLabel(/症状/i)).toBeVisible()
    
    await expect(page.getByRole('button', { name: /記録を保存/i })).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await page.getByRole('button', { name: /記録を保存/i }).click()
    
    await expect(page.getByText(/収縮期血圧を入力してください/i)).toBeVisible()
    await expect(page.getByText(/拡張期血圧を入力してください/i)).toBeVisible()
  })

  test('should validate blood pressure ranges', async ({ page }) => {
    await page.getByLabel(/収縮期血圧/i).fill('300')
    await page.getByLabel(/拡張期血圧/i).fill('200')
    
    await page.getByRole('button', { name: /記録を保存/i }).click()
    
    await expect(page.getByText(/収縮期血圧は50-300の範囲で入力してください/i)).toBeVisible()
    await expect(page.getByText(/拡張期血圧は30-200の範囲で入力してください/i)).toBeVisible()
  })

  test('should validate heart rate range', async ({ page }) => {
    await page.getByLabel(/心拍数/i).fill('300')
    
    await page.getByRole('button', { name: /記録を保存/i }).click()
    
    await expect(page.getByText(/心拍数は30-220の範囲で入力してください/i)).toBeVisible()
  })

  test('should validate weight and height', async ({ page }) => {
    await page.getByLabel(/体重/i).fill('-10')
    await page.getByLabel(/身長/i).fill('300')
    
    await page.getByRole('button', { name: /記録を保存/i }).click()
    
    await expect(page.getByText(/体重は正の数値で入力してください/i)).toBeVisible()
    await expect(page.getByText(/身長は50-250cmの範囲で入力してください/i)).toBeVisible()
  })

  test('should submit valid form data', async ({ page }) => {
    // Mock successful API response
    await page.route('**/api/health-data', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({
            id: 'new-record-id',
            message: '健康データが正常に保存されました'
          })
        })
      }
    })

    // Fill in valid data
    await page.getByLabel(/収縮期血圧/i).fill('120')
    await page.getByLabel(/拡張期血圧/i).fill('80')
    await page.getByLabel(/心拍数/i).fill('72')
    await page.getByLabel(/体重/i).fill('70.5')
    await page.getByLabel(/身長/i).fill('175')
    await page.getByLabel(/症状/i).fill('headache, fatigue')

    await page.getByRole('button', { name: /記録を保存/i }).click()

    // Should show success message
    await expect(page.getByText(/健康データが正常に保存されました/i)).toBeVisible()
    
    // Should redirect to dashboard
    await expect(page).toHaveURL(/.*\/dashboard/)
  })

  test('should handle API errors', async ({ page }) => {
    // Mock API error response
    await page.route('**/api/health-data', async route => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 500,
          contentType: 'application/json',
          body: JSON.stringify({
            error: 'サーバーエラーが発生しました'
          })
        })
      }
    })

    // Fill in minimal valid data
    await page.getByLabel(/収縮期血圧/i).fill('120')
    await page.getByLabel(/拡張期血圧/i).fill('80')

    await page.getByRole('button', { name: /記録を保存/i }).click()

    await expect(page.getByText(/サーバーエラーが発生しました/i)).toBeVisible()
    
    // Should remain on the form page
    await expect(page).toHaveURL(/.*\/health\/record/)
  })

  test('should show loading state during submission', async ({ page }) => {
    // Mock slow API response
    await page.route('**/api/health-data', async route => {
      if (route.request().method() === 'POST') {
        await new Promise(resolve => setTimeout(resolve, 1000))
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 'new-record-id' })
        })
      }
    })

    await page.getByLabel(/収縮期血圧/i).fill('120')
    await page.getByLabel(/拡張期血圧/i).fill('80')

    await page.getByRole('button', { name: /記録を保存/i }).click()

    // Should show loading state
    await expect(page.getByText(/保存中/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /記録を保存/i })).toBeDisabled()
  })

  test('should handle symptoms input', async ({ page }) => {
    const symptomsInput = page.getByLabel(/症状/i)
    
    await symptomsInput.fill('headache, fatigue, dizziness')
    
    // Should accept comma-separated symptoms
    await expect(symptomsInput).toHaveValue('headache, fatigue, dizziness')
  })

  test('should provide health data input suggestions', async ({ page }) => {
    // Type partial blood pressure value
    await page.getByLabel(/収縮期血圧/i).fill('1')
    
    // Should show input validation hints
    await expect(page.getByText(/正常範囲: 90-140 mmHg/i)).toBeVisible()
  })

  test('should be responsive on mobile devices', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Form should be usable on mobile
    await expect(page.getByRole('heading', { name: /健康データの記録/i })).toBeVisible()
    await expect(page.getByLabel(/収縮期血圧/i)).toBeVisible()
    
    // Form fields should stack vertically
    const formContainer = page.locator('[data-testid="health-form"]')
    await expect(formContainer).toHaveClass(/flex-col/)
  })

  test('should navigate back to dashboard', async ({ page }) => {
    await page.getByRole('button', { name: /戻る/i }).click()
    
    await expect(page).toHaveURL(/.*\/dashboard/)
  })

  test('should clear form data on reset', async ({ page }) => {
    // Fill some data
    await page.getByLabel(/収縮期血圧/i).fill('120')
    await page.getByLabel(/心拍数/i).fill('72')
    
    // Click reset/clear button
    await page.getByRole('button', { name: /クリア/i }).click()
    
    // Form should be cleared
    await expect(page.getByLabel(/収縮期血圧/i)).toHaveValue('')
    await expect(page.getByLabel(/心拍数/i)).toHaveValue('')
  })
})