import { test, expect } from '@playwright/test';
import * as config from '../../config';
import { createAuthInstance, createTask } from '../../helpers/api';
import { clickTaskButton, getTestID, login } from '../../helpers/helpers';

const { baseURL, username, password } = config;
const dataTaskComplete = {
    name: `test task - ${getTestID()}`,
    description: 'created by test with api',
};

const dataTaskEdit = {
    name: `test task - ${getTestID()}`,
    description: 'created by test with api',
};

const dateNow = new Date();

test.describe('User can edit tasks', async () => {
    let taskForCompleteTitle: string;
    let taskForEditTitle: string;

    test.beforeAll(async () => {
        const authInstance = await createAuthInstance({ username, password });
        const taskCompleteData = (
            await createTask({ authInstance, data: dataTaskComplete })
        ).data;
        taskForCompleteTitle = taskCompleteData.name;

        const taskEditData = (
            await createTask({ authInstance, data: dataTaskEdit })
        ).data;
        taskForEditTitle = taskEditData.name;
    });

    test.beforeEach(async ({ page }) => {
        await test.step('Go to DeltaGreen app', async () => {
            await page.goto(baseURL, { waitUntil: 'networkidle' });
        });
        await test.step('Login', async () => {
            await login({ page, username, password });
        });
    });

    test('User can mark task as complete', async ({ page }) => {
        await test.step('Set task as complete', async () => {
            await Promise.all([
                clickTaskButton({
                    page,
                    taskTitle: taskForCompleteTitle,
                    buttonType: 'complete',
                }),
                page.waitForResponse(
                    (response) =>
                        response.url().includes('task.complete') &&
                        response.status() === 200
                ),
            ]);
        });

        await test.step('Check if task appears as completed', async () => {
            await page.reload({ waitUntil: 'networkidle' });

            expect(
                await page
                    .locator('div[class*="rounded-md"]', {
                        has: page.locator('p', {
                            hasText: taskForCompleteTitle,
                        }),
                    })
                    .textContent()
            ).toContain('Completed at');
        });
    });

    test('User can edit a task', async ({ page }) => {
        const titleEdit = dataTaskEdit.name + ' edited';

        await test.step('Start an edit of task', async () => {
            await clickTaskButton({
                page,
                taskTitle: taskForEditTitle,
                buttonType: 'edit',
            });
        });

        await test.step('Change title and edit ', async () => {
            await page.locator('#title').fill(titleEdit);

            await Promise.all([
                page.locator('button', { hasText: 'Save changes' }).click(),
                page.waitForResponse(
                    (response) =>
                        response.url().includes('task.update') &&
                        response.status() === 200
                ),
            ]);
        });

        await test.step('Check if the title has changed', async () => {
            await page.locator('p', { hasText: titleEdit }).waitFor();
        });
    });
});
