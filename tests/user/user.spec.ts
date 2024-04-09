import { test, expect } from '@playwright/test';
import * as config from '../../config';

const { baseURL, username, password } = config;

test.describe('User can login or logout', async () => {
    test('User can login and logout', async ({ page }) => {
        await test.step('Go to DeltaGreen page', async () => {
            await page.goto(baseURL, { waitUntil: 'networkidle' });
        });

        await test.step('Fill all required inputs', async () => {
            await page.locator('#username').fill(username);
            await page.locator('#password').fill(password);
        });

        await test.step('Log in and check network', async () => {
            await Promise.all([
                page.locator('button').click(),
                page.waitForResponse(
                    (response) =>
                        response.url().includes('/auth/login') &&
                        response.status() === 303
                ),
            ]);
        });

        await test.step('Check if login went through ok', async () => {
            await page.waitForLoadState('networkidle');
            await page.locator('h1', { hasText: 'Your Todo list' }).waitFor();
        });

        await test.step('Logout', async () => {
            await Promise.all([
                page.locator('button[type="submit"]').click(),
                page.waitForResponse(
                    (response) =>
                        response.url() === baseURL && response.status() === 303
                ),
            ]);
        });

        await test.step('Check if logout went through ok', async () => {
            await page.waitForLoadState('networkidle');
            await page.locator('h1', { hasText: 'Login' }).waitFor();
        });
    });

    // Might be flaky, though I couldn't figure out how to test this case some other way
    test('User cannot login without filling all required inputs', async ({
        page,
    }) => {
        await test.step('Go to DeltaGreen page', async () => {
            await page.goto(baseURL, { waitUntil: 'networkidle' });
        });

        await test.step('Left Username field empty and try to log in', async () => {
            let loginRequest = false;

            await page.locator('#password').fill(password);

            page.on('request', (request) => {
                if (request.url() === `${baseURL}auth/login`)
                    loginRequest = true;
            });
            await page.locator('button').click();
            expect(loginRequest).toBe(false);

            await page.locator('#password').fill('');
        });

        await test.step('Left Password field empty and try to log in', async () => {
            let loginRequest = false;

            await page.locator('#username').fill(username);

            page.on('request', (request) => {
                if (request.url() === `${baseURL}auth/login`)
                    loginRequest = true;
            });
            await page.locator('button').click();
            expect(loginRequest).toBe(false);
        });
    });
});
