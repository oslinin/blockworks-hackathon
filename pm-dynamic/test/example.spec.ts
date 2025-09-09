// test/example.spec.ts (Modified for TSender)
import { test, expect } from "@playwright/test"
test("has title", async ({ page }) => {
    // Navigate to the app's root page (uses baseURL from config)
    await page.goto("/")
    // Expect the page title to be exactly "TSender".
    await expect(page).toHaveTitle("TSender")
})
