import { expect, test } from "@playwright/test";

test("homepage has title", async ({ page }) => {
  await page.goto("/");

  await expect(page).toHaveTitle(/Pass-in-Closet/i);
});

test("can navigate to login", async ({ page }) => {
  await page.goto("/");

  // Should redirect to dashboard or login
  await expect(page).toHaveURL(/login|dashboard/);
});
