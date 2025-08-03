import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should redirect to auth page when not logged in', async ({ page }) => {
    await expect(page).toHaveURL(/.*\/auth/)
  })

  test('should display login form', async ({ page }) => {
    await page.goto('/auth')
    
    await expect(page.getByRole('heading', { name: /ログイン/i })).toBeVisible()
    await expect(page.getByLabel(/メールアドレス/i)).toBeVisible()
    await expect(page.getByLabel(/パスワード/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /ログイン/i })).toBeVisible()
  })

  test('should show validation errors for empty form', async ({ page }) => {
    await page.goto('/auth')
    
    await page.getByRole('button', { name: /ログイン/i }).click()
    
    await expect(page.getByText(/メールアドレスを入力してください/i)).toBeVisible()
    await expect(page.getByText(/パスワードを入力してください/i)).toBeVisible()
  })

  test('should show validation error for invalid email', async ({ page }) => {
    await page.goto('/auth')
    
    await page.getByLabel(/メールアドレス/i).fill('invalid-email')
    await page.getByLabel(/パスワード/i).fill('password123')
    await page.getByRole('button', { name: /ログイン/i }).click()
    
    await expect(page.getByText(/有効なメールアドレスを入力してください/i)).toBeVisible()
  })

  test('should toggle between login and signup forms', async ({ page }) => {
    await page.goto('/auth')
    
    // Initially should show login form
    await expect(page.getByRole('heading', { name: /ログイン/i })).toBeVisible()
    
    // Click to switch to signup
    await page.getByText(/アカウントをお持ちでない方/i).click()
    
    await expect(page.getByRole('heading', { name: /新規登録/i })).toBeVisible()
    await expect(page.getByLabel(/氏名/i)).toBeVisible()
    await expect(page.getByLabel(/会社名/i)).toBeVisible()
    
    // Click to switch back to login
    await page.getByText(/既にアカウントをお持ちの方/i).click()
    
    await expect(page.getByRole('heading', { name: /ログイン/i })).toBeVisible()
  })

  test('should show terms and privacy policy checkboxes in signup', async ({ page }) => {
    await page.goto('/auth')
    
    // Switch to signup form
    await page.getByText(/アカウントをお持ちでない方/i).click()
    
    await expect(page.getByText(/利用規約に同意する/i)).toBeVisible()
    await expect(page.getByText(/プライバシーポリシーに同意する/i)).toBeVisible()
  })

  test('should show loading state during login attempt', async ({ page }) => {
    await page.goto('/auth')
    
    await page.getByLabel(/メールアドレス/i).fill('test@example.com')
    await page.getByLabel(/パスワード/i).fill('password123')
    
    // Mock slow API response
    await page.route('**/api/auth/login', async route => {
      await new Promise(resolve => setTimeout(resolve, 1000))
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Invalid credentials' })
      })
    })
    
    await page.getByRole('button', { name: /ログイン/i }).click()
    
    // Should show loading state
    await expect(page.getByText(/処理中/i)).toBeVisible()
    await expect(page.getByRole('button', { name: /ログイン/i })).toBeDisabled()
  })

  test('should handle login failure gracefully', async ({ page }) => {
    await page.goto('/auth')
    
    // Mock failed login response
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'メールアドレスまたはパスワードが正しくありません' })
      })
    })
    
    await page.getByLabel(/メールアドレス/i).fill('test@example.com')
    await page.getByLabel(/パスワード/i).fill('wrongpassword')
    await page.getByRole('button', { name: /ログイン/i }).click()
    
    await expect(page.getByText(/メールアドレスまたはパスワードが正しくありません/i)).toBeVisible()
  })

  test('should remember login state', async ({ page, context }) => {
    // Mock successful login
    await page.route('**/api/auth/login', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          user: {
            id: '1',
            email: 'test@example.com',
            name: 'Test User',
            role: 'user'
          },
          token: 'fake-jwt-token'
        })
      })
    })

    await page.goto('/auth')
    await page.getByLabel(/メールアドレス/i).fill('test@example.com')
    await page.getByLabel(/パスワード/i).fill('password123')
    await page.getByRole('button', { name: /ログイン/i }).click()

    // Should redirect to dashboard after successful login
    await expect(page).toHaveURL(/.*\/dashboard/)

    // Create new page in same context (should preserve localStorage)
    const newPage = await context.newPage()
    await newPage.goto('/')
    
    // Should already be logged in and redirect to dashboard
    await expect(newPage).toHaveURL(/.*\/dashboard/)
  })
})