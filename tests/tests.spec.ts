import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('show sign in page', async ({ page }) => {
    await page.goto('/');

    // Expects page to have login button
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('app redirects to sign in page when non-authenticated', async ({ page }) => {
    await page.goto('/app');

    // Expect redirect
    await expect(async () => {
      expect(page).toHaveURL('/');
    }).toPass();

    await page.waitForLoadState("networkidle");

    // Expects page to have login button
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('login with github and be redirected to app page', async ({ page }) => {
    test.setTimeout(120_000);

    await page.goto("/");
    await page.getByTestId("login-button").click();

    await page.waitForLoadState("networkidle");

    await page.locator("xpath=//input[@id='login_field']").fill(process.env.GH_TEST_LOGIN!);
    await page.locator("xpath=//input[@id='password']").fill(process.env.GH_TEST_PASSWORD!);
    await page.getByRole('button', { name: 'Sign in', exact: true }).click();

    await expect(async () => {
      expect(page).toHaveURL('/');
    }).toPass();

    await page.waitForLoadState("networkidle");

    //assert we got the token cookie
    const context = await page.context();
    var cookies = await context.cookies();
    var token = cookies.find(c => c.name == 'token') ?? { name: '' };
    await expect(token.name).toBe('token');

    //i don't know why, but playwright won't follow the same redirect as a normal browser
    await page.getByTestId("login-button").click();

    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL('/app');
  });

});