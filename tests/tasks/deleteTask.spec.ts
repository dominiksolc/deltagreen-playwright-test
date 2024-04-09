import { test, expect } from '@playwright/test';
import { clickTaskButton, getTestID, login } from '../../helpers/helpers';
import * as config from '../../config';
import { createAuthInstance, createTask } from '../../helpers/api';

const { baseURL, username, password } = config;
const data = {
    name: `test task - ${getTestID}`,
    description: 'created by test with api',
};

test.describe('Task creation by user', async () => {
    let taskTitle: string;

    test.beforeAll(async () => {
        const authInstance = await createAuthInstance({ username, password });
        const taskData = (await createTask({ authInstance, data })).data;
        taskTitle = taskData.name;
    });

    test.beforeEach(async ({ page }) => {
        await test.step('Go to DeltaGreen app', async () => {
            await page.goto(baseURL, { waitUntil: 'networkidle' });
        });
        await test.step('Login', async () => {
            await login({ page, username, password });
        });
    });

    test('User can delete a task', async ({ page }) => {
        await test.step('Delete task', async () => {
            await Promise.all([
                clickTaskButton({
                    page,
                    taskTitle,
                    buttonType: 'delete',
                }),
                page.waitForResponse(
                    (response) =>
                        response.url().includes('task.delete') &&
                        response.status() === 200
                ),
                page.locator('[data-type="success"]').waitFor(),
            ]);
        });

        await test.step('Task should not be in dashboard', async () => {
            await expect(page.locator('p', { hasText: taskTitle })).toHaveCount(
                0
            );
        });
    });
});
