import { test, expect } from "@playwright/test";

test("redirects to sign up page", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveURL("/app/sign-up");
});
