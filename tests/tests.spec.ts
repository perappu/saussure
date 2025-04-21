import { test, expect } from '@playwright/test';

test.describe('Authentication', () => {
  test('show sign in page', async ({ page, context }) => {
    await page.goto('/');

    // Expects page to have login button
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('app redirects to sign in page when non-authenticated', async ({ page, context }) => {
    await page.goto('/app');

    // Expect redirect
    await expect(async () => {
      expect(page).toHaveURL('/');
    }).toPass();

    await page.waitForLoadState("networkidle");

    // Expects page to have login button
    await expect(page.getByTestId('login-button')).toBeVisible();
  });

  test('login with github and be redirected to app page', async ({ page, context }) => {
    test.setTimeout(120_000);

    await page.goto("/");
    await page.getByTestId("login-button").click();

    await page.waitForLoadState("networkidle");

    //handling if github is asking to relogin
    if (await page.locator("xpath=//input[@id='login_field']").isVisible()) {
      await page.locator("xpath=//input[@id='login_field']").fill(process.env.GH_TEST_LOGIN!);
      await page.locator("xpath=//input[@id='password']").fill(process.env.GH_TEST_PASSWORD!);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();

      await page.waitForLoadState("networkidle");
    }

    //handling for if github is asking to re-authorize
    if (await page.isVisible("text='Authorize saussure local'")) {
      await page.waitForTimeout(5000);
      await page.locator("xpath=//button[contains(@class, 'js-oauth-authorize-btn')]").click();
      await page.waitForLoadState("networkidle");
    }

    //assert we got the token cookie
    var cookies = await context.cookies();
    var token = cookies.find(c => c.name == 'token') ?? { name: '' };
    await expect(token.name).toBe('token');

    await page.waitForLoadState("networkidle");

    //i don't know why, but playwright won't follow the same redirect as a normal browser in this circumstance
    await page.getByTestId("login-button").click();

    await expect(page).toHaveURL('/app');
  });

});