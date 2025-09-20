import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should redirect to login when accessing protected route', async ({ page }) => {
    await page.goto('/profile')
    
    // Should redirect to login page
    await expect(page).toHaveURL('/login')
    await expect(page.locator('h1')).toContainText('Login')
  })

  test('should redirect to enhance after successful login', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in login form
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Should redirect to enhance page
    await expect(page).toHaveURL('/enhance')
    await expect(page.locator('h1')).toContainText('PromptBrain')
  })

  test('should redirect to enhance after successful signup', async ({ page }) => {
    await page.goto('/signup')
    
    // Fill in signup form
    await page.fill('input[type="email"]', 'newuser@example.com')
    await page.fill('input[type="password"]', 'password123')
    await page.fill('input[type="password"]:nth-of-type(2)', 'password123')
    
    // Click signup button
    await page.click('button[type="submit"]')
    
    // Should redirect to enhance page
    await expect(page).toHaveURL('/enhance')
    await expect(page.locator('h1')).toContainText('PromptBrain')
  })

  test('should handle Google OAuth flow', async ({ page }) => {
    await page.goto('/login')
    
    // Click Google sign in button
    await page.click('button:has-text("Sign in with Google")')
    
    // Should show loading state
    await expect(page.locator('button:has-text("Sign in with Google")')).toBeDisabled()
  })

  test('should show error for invalid credentials', async ({ page }) => {
    await page.goto('/login')
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com')
    await page.fill('input[type="password"]', 'wrongpassword')
    
    // Click login button
    await page.click('button[type="submit"]')
    
    // Should show error message
    await expect(page.locator('[role="alert"]')).toBeVisible()
    await expect(page.locator('[role="alert"]')).toContainText('Invalid credentials')
  })

  test('should validate form fields', async ({ page }) => {
    await page.goto('/login')
    
    // Try to submit empty form
    await page.click('button[type="submit"]')
    
    // Should show validation errors
    await expect(page.locator('input[type="email"]:invalid')).toBeVisible()
    await expect(page.locator('input[type="password"]:invalid')).toBeVisible()
  })
})
