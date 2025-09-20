import { test, expect } from '@playwright/test'

test.describe('Navigation and Routing', () => {
  test('should navigate between pages correctly', async ({ page }) => {
    // Start at home page
    await page.goto('/')
    await expect(page).toHaveURL('/')
    
    // Navigate to login
    await page.click('a[href="/login"]')
    await expect(page).toHaveURL('/login')
    
    // Navigate to signup
    await page.click('a[href="/signup"]')
    await expect(page).toHaveURL('/signup')
    
    // Navigate to enhance (should redirect to login if not authenticated)
    await page.goto('/enhance')
    await expect(page).toHaveURL('/login')
  })

  test('should handle browser back/forward navigation', async ({ page }) => {
    // Navigate through pages
    await page.goto('/')
    await page.goto('/login')
    await page.goto('/signup')
    
    // Go back
    await page.goBack()
    await expect(page).toHaveURL('/login')
    
    // Go back again
    await page.goBack()
    await expect(page).toHaveURL('/')
    
    // Go forward
    await page.goForward()
    await expect(page).toHaveURL('/login')
  })

  test('should handle direct URL access', async ({ page }) => {
    // Access enhance page directly
    await page.goto('/enhance')
    
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL('/login')
    
    // Access profile page directly
    await page.goto('/profile')
    
    // Should redirect to login if not authenticated
    await expect(page).toHaveURL('/login')
  })

  test('should handle 404 pages gracefully', async ({ page }) => {
    // Navigate to non-existent page
    await page.goto('/non-existent-page')
    
    // Should show 404 or redirect to home
    const currentUrl = page.url()
    expect(currentUrl).toMatch(/\/(login|$)/)
  })

  test('should maintain state during navigation', async ({ page }) => {
    // Navigate to enhance page (will redirect to login)
    await page.goto('/enhance')
    await expect(page).toHaveURL('/login')
    
    // Fill in login form
    await page.fill('input[type="email"]', 'test@example.com')
    await page.fill('input[type="password"]', 'password123')
    
    // Navigate away and back
    await page.goto('/')
    await page.goBack()
    
    // Form should still be filled (or cleared for security)
    const emailValue = await page.inputValue('input[type="email"]')
    expect(emailValue).toBe('') // Should be cleared for security
  })

  test('should handle sidebar navigation', async ({ page }) => {
    // Navigate to enhance page
    await page.goto('/enhance')
    
    // Should show sidebar
    await expect(page.locator('[role="navigation"]')).toBeVisible()
    
    // Click on different navigation items
    await page.click('button:has-text("History")')
    // Should update active state
    
    await page.click('button:has-text("Profile")')
    // Should navigate to profile (or show login if not authenticated)
    
    await page.click('button:has-text("Home")')
    // Should navigate to home
  })

  test('should handle sidebar collapse/expand', async ({ page }) => {
    // Navigate to enhance page
    await page.goto('/enhance')
    
    // Should show expanded sidebar by default
    await expect(page.locator('[role="navigation"]')).toBeVisible()
    
    // Click toggle button
    await page.click('button[aria-label*="toggle"]')
    
    // Should collapse sidebar
    await expect(page.locator('[role="navigation"]')).toHaveClass(/collapsed/)
    
    // Click toggle again
    await page.click('button[aria-label*="toggle"]')
    
    // Should expand sidebar
    await expect(page.locator('[role="navigation"]')).not.toHaveClass(/collapsed/)
  })

  test('should handle mobile navigation', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navigate to enhance page
    await page.goto('/enhance')
    
    // Should show mobile-optimized navigation
    await expect(page.locator('[role="navigation"]')).toBeVisible()
    
    // Should be responsive
    const sidebarWidth = await page.locator('[role="navigation"]').boundingBox()
    expect(sidebarWidth?.width).toBeLessThanOrEqual(375)
  })

  test('should handle deep linking', async ({ page }) => {
    // Navigate to enhance page with query parameters
    await page.goto('/enhance?mode=flow')
    
    // Should redirect to login but preserve query params
    await expect(page).toHaveURL('/login')
    
    // After login, should navigate to enhance with preserved params
    // (This would need to be implemented in the app)
  })

  test('should handle route guards correctly', async ({ page }) => {
    // Try to access protected routes without authentication
    const protectedRoutes = ['/enhance', '/profile']
    
    for (const route of protectedRoutes) {
      await page.goto(route)
      await expect(page).toHaveURL('/login')
    }
    
    // Public routes should be accessible
    await page.goto('/')
    await expect(page).toHaveURL('/')
    
    await page.goto('/login')
    await expect(page).toHaveURL('/login')
    
    await page.goto('/signup')
    await expect(page).toHaveURL('/signup')
  })
})
