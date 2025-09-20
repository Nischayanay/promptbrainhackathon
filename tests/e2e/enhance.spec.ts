import { test, expect } from '@playwright/test'

test.describe('Prompt Enhancement', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to enhance page
    await page.goto('/enhance')
  })

  test('should enhance prompt successfully', async ({ page }) => {
    // Fill in prompt input
    const promptText = 'Create a marketing strategy for a new AI product'
    await page.fill('textarea[placeholder*="prompt"]', promptText)
    
    // Click enhance button
    await page.click('button:has-text("Enhance")')
    
    // Should show loading state
    await expect(page.locator('[role="status"]')).toBeVisible()
    await expect(page.locator('[role="status"]')).toContainText('Enhancing your prompt')
    
    // Wait for enhancement to complete
    await expect(page.locator('[role="status"]')).not.toBeVisible()
    
    // Should show enhanced output
    await expect(page.locator('article')).toBeVisible()
    await expect(page.locator('article')).toContainText('Enhanced')
    
    // Should show input in history
    await expect(page.locator('article')).toContainText(promptText)
  })

  test('should switch between ideate and flow modes', async ({ page }) => {
    // Should start in ideate mode
    await expect(page.locator('button[aria-pressed="true"]')).toContainText('Ideate')
    
    // Switch to flow mode
    await page.click('button:has-text("Flow")')
    await expect(page.locator('button[aria-pressed="true"]')).toContainText('Flow')
    
    // Should show flow question card
    await expect(page.locator('[role="region"]')).toContainText('question')
    
    // Switch back to ideate mode
    await page.click('button:has-text("Ideate")')
    await expect(page.locator('button[aria-pressed="true"]')).toContainText('Ideate')
  })

  test('should handle flow mode progression', async ({ page }) => {
    // Switch to flow mode
    await page.click('button:has-text("Flow")')
    
    // Answer first question
    await page.fill('textarea', 'AI-powered customer service automation')
    await page.click('button:has-text("Next")')
    
    // Should show next question
    await expect(page.locator('[role="region"]')).toContainText('question')
    
    // Answer second question
    await page.fill('textarea', 'Small to medium businesses')
    await page.click('button:has-text("Next")')
    
    // Should show final question
    await expect(page.locator('[role="region"]')).toContainText('question')
    
    // Complete flow
    await page.fill('textarea', 'Increase customer satisfaction by 40%')
    await page.click('button:has-text("Complete")')
    
    // Should switch back to ideate mode with structured prompt
    await expect(page.locator('button[aria-pressed="true"]')).toContainText('Ideate')
    await expect(page.locator('textarea')).toContainText('AI-powered customer service automation')
  })

  test('should show low credits warning', async ({ page }) => {
    // Mock low credits state
    await page.evaluate(() => {
      localStorage.setItem('pbm_credits', '3')
    })
    
    // Reload page
    await page.reload()
    
    // Should show low credits banner
    await expect(page.locator('[role="alert"]')).toBeVisible()
    await expect(page.locator('[role="alert"]')).toContainText('Low credits warning')
    await expect(page.locator('[role="alert"]')).toContainText('3 credits remaining')
  })

  test('should prevent enhancement with insufficient credits', async ({ page }) => {
    // Mock zero credits
    await page.evaluate(() => {
      localStorage.setItem('pbm_credits', '0')
    })
    
    // Reload page
    await page.reload()
    
    // Fill in prompt
    await page.fill('textarea[placeholder*="prompt"]', 'Test prompt')
    
    // Enhance button should be disabled
    await expect(page.locator('button:has-text("Enhance")')).toBeDisabled()
  })

  test('should copy output to clipboard', async ({ page }) => {
    // Enhance a prompt first
    await page.fill('textarea[placeholder*="prompt"]', 'Test prompt')
    await page.click('button:has-text("Enhance")')
    
    // Wait for enhancement to complete
    await expect(page.locator('[role="status"]')).not.toBeVisible()
    
    // Click copy button
    await page.click('button:has-text("Copy")')
    
    // Should show success message
    await expect(page.locator('[aria-live="polite"]')).toContainText('Output copied to clipboard')
  })

  test('should reuse input as new prompt', async ({ page }) => {
    // Enhance a prompt first
    const originalPrompt = 'Original test prompt'
    await page.fill('textarea[placeholder*="prompt"]', originalPrompt)
    await page.click('button:has-text("Enhance")')
    
    // Wait for enhancement to complete
    await expect(page.locator('[role="status"]')).not.toBeVisible()
    
    // Clear input
    await page.fill('textarea[placeholder*="prompt"]', '')
    
    // Click reuse button
    await page.click('button:has-text("Use as new input")')
    
    // Should populate input with original prompt
    await expect(page.locator('textarea[placeholder*="prompt"]')).toHaveValue(originalPrompt)
  })

  test('should persist chat history', async ({ page }) => {
    // Enhance a prompt
    await page.fill('textarea[placeholder*="prompt"]', 'Persistent test prompt')
    await page.click('button:has-text("Enhance")')
    
    // Wait for enhancement to complete
    await expect(page.locator('[role="status"]')).not.toBeVisible()
    
    // Reload page
    await page.reload()
    
    // Should show previous enhancement in history
    await expect(page.locator('article')).toContainText('Persistent test prompt')
  })

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Focus on input
    await page.focus('textarea[placeholder*="prompt"]')
    
    // Type prompt
    await page.keyboard.type('Keyboard shortcut test')
    
    // Use Ctrl+Enter to enhance
    await page.keyboard.press('Control+Enter')
    
    // Should start enhancement
    await expect(page.locator('[role="status"]')).toBeVisible()
  })
})
