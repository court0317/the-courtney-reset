const { test, expect } = require('playwright/test');
test('smoke', async ({ page }) => { await page.goto('http://127.0.0.1:4173'); await expect(page).toHaveTitle(/Flourish & Bloom/); });
