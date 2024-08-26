import { test, expect } from "@playwright/test";

test("navigates to sign in page when clicking sign in link", async ({
  page,
}) => {
  await page.goto("/app/sign-up");
  await page.getByRole("link", { name: "Sign in" }).click();
  await expect(page).toHaveURL("/app/sign-in");
});

test("shows error when signing up with invalid email format", async ({
  page,
}) => {
  await page.goto("/app/sign-up");
  await page.getByPlaceholder("name@example.com").click();
  await page.getByPlaceholder("name@example.com").fill("a random text!");
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page.getByText("Invalid email")).toBeVisible();
});

test("shows error when verification code is invalid", async ({ page }) => {
  await page.goto("/app/sign-up");
  await page.getByPlaceholder("name@example.com").click();
  await page.getByPlaceholder("name@example.com").fill("test@kiwiy.is");
  await page.getByRole("button", { name: "Sign up" }).click();
  await page.getByLabel("Code").click();
  await page.getByLabel("Code").fill("000000");
  await page.getByRole("button", { name: "Continue" }).click();
  await expect(page.getByText("Token has expired or is")).toBeVisible();
});

test("redirects to verify page after form submission", async ({ page }) => {
  await page.goto("/app/sign-up");
  await page.getByPlaceholder("name@example.com").click();
  await page.getByPlaceholder("name@example.com").fill("test@example.com");
  await page.getByRole("button", { name: "Sign up" }).click();
  await expect(page).toHaveURL(
    "/app/sign-up/verify?email=test%2540example.com"
  );
  await expect(
    page.getByRole("heading", { name: "Verify code" })
  ).toBeVisible();
});

test("redirects to create profile page after successful sign up", async ({
  page,
  context,
}) => {
  // test.skip(process.env.APP_ENV !== "local", "Only runs in local development");

  await page.goto("/app/sign-up");
  await page.getByPlaceholder("name@example.com").click();

  const timestamp = new Date().getTime();
  const dynamicEmailHandle = `sign-up-test-${timestamp}`;

  await page
    .getByPlaceholder("name@example.com")
    .fill(`${dynamicEmailHandle}@example.com`);
  await page.getByRole("button", { name: "Sign up" }).click();

  const inbucketPage = await context.newPage();

  await inbucketPage.goto("http://localhost:54324/monitor");
  await inbucketPage.getByRole("cell", { name: dynamicEmailHandle }).click();
  const codeElement = inbucketPage.getByText(
    /Alternatively, enter the code:\s*(\d+)/
  );

  await expect(codeElement).toBeVisible();

  const text = await codeElement.innerText();
  const match = text.match(/Alternatively, enter the code:\s*(\d+)/);
  const code = match![1]; // We can use non-null assertion here because we've already checked for visibility

  await inbucketPage.close();

  await page.getByLabel("Code").click();
  await page.getByLabel("Code").fill(code);

  await page.getByRole("button", { name: "Continue" }).click();

  await page.getByRole("heading", { name: "Create profile" }).click();

  await expect(page).toHaveURL("/app/onboard/create-profile");
  await expect(
    page.getByRole("heading", { name: "Create profile" })
  ).toBeVisible();
});
