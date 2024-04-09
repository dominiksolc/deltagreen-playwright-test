import { test, expect } from '@playwright/test';
import { getTestID, login } from '../../helpers/helpers';
import * as config from '../../config';

const { baseURL, username, password } = config;

test.describe('Task creation by user', async () => {
    let taskTitle = `test task - ${getTestID()}`;
    let taskDescription = 'test description';

    test.beforeEach(async ({ page }) => {
        await test.step('Go to DeltaGreen app', async () => {
            await page.goto(baseURL, { waitUntil: 'networkidle' });
        });
        await test.step('Login', async () => {
            await login({ page, username, password });
        });
    });

    test('User creates a task', async ({ page }) => {
        let createTaskRequest = false;

        await test.step('Start creating a new task', async () => {
            await page.locator('a[href="/tasks/new"]').click();

            await page.locator('h1', { hasText: 'New Task' }).waitFor();
        });

        await test.step('Check if user can go back', async () => {
            await page.locator('a').click();

            await page.locator('h1', { hasText: 'Your Todo list' }).waitFor();
        });

        await test.step('Go back to task creation', async () => {
            await page.locator('a[href="/tasks/new"]').click();
        });

        await test.step('Check if task cannot be created without a title', async () => {
            page.on('request', (request) => {
                if (request.url().includes('/auth/login'))
                    createTaskRequest = true;
            });

            await page.locator('button', { hasText: 'Create' }).click();
            expect(createTaskRequest).toBe(false);
        });

        await test.step('Fill all fields', async () => {
            await page.locator('#title').fill(taskTitle);
            await page.locator('#description').fill(taskDescription);
        });

        await test.step('Submit task', async () => {
            await Promise.all([
                page.locator('button', { hasText: 'Create' }).click(),
                page.waitForResponse(
                    (response) =>
                        response.url().includes('/tasks/new') &&
                        response.status() === 303
                ),
            ]);
        });

        await test.step('Check if the new task appears in dashboard', async () => {
            await page.locator('p', { hasText: taskTitle }).waitFor();
        });
    });
});
