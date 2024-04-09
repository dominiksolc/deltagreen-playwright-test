import { test, expect } from '@playwright/test';
import {
    completeTask,
    createAuthInstance,
    createTask,
    deleteTask,
    updateTask,
} from '../../helpers/api';
import * as config from '../../config';
import { getTestID, login } from '../../helpers/helpers';
import { AxiosInstance } from 'axios';

const { username, password, baseURL } = config;

const data = {
    name: `test api creation - ${getTestID()}`,
    description: 'created by test with api',
};
const dataDelete = {
    name: `test api delete - ${getTestID()}`,
    description: 'created by test with api',
};

test.describe('Tasks API', async () => {
    let taskID: string;
    let taskCreatedAtData: string;
    let taskCreatedAt: string;
    let authInstance: AxiosInstance;
    let taskTitle: string;
    let taskTitleEdit: string;

    test.beforeAll(async () => {
        authInstance = await createAuthInstance({ username, password });
    });

    test('User can see dashboard with task created and edited by API', async ({
        page,
    }) => {
        await test.step('Create a task', async () => {
            const taskData = (await createTask({ authInstance, data })).data;
            ({
                id: taskID,
                createdAt: taskCreatedAtData,
                name: taskTitle,
            } = taskData);

            const [calendarDay, timeOfDay] = taskCreatedAtData.split('T');
            const [year, month, day] = calendarDay.split('-');
            const [hour, minutes] = timeOfDay.split(':');

            taskCreatedAt = `${day}.${month}.${year} ${hour}:${minutes}`;
        });

        await test.step('Go to DeltaGreen app and see, if the task is vissible', async () => {
            await page.goto(baseURL, { waitUntil: 'networkidle' });

            await login({ page, username, password });

            expect(
                await page
                    .locator('div[class*="rounded-md"]', {
                        has: page.locator('p', {
                            hasText: taskTitle,
                        }),
                    })
                    .locator('p', { hasText: 'Created at: ' })
                    .textContent()
            ).toContain(taskCreatedAt);
        });

        await test.step('Edit task by API and check if it changed in UI also', async () => {
            taskTitleEdit = data.name + ' edited';

            await updateTask({
                authInstance,
                data: { name: taskTitleEdit },
                taskID,
            });

            await page.reload({ waitUntil: 'networkidle' });

            expect(
                await page
                    .locator('div[class*="rounded-md"]', {
                        has: page.locator('p', {
                            hasText: taskTitleEdit,
                        }),
                    })
                    .locator('p', { hasText: 'Created at: ' })
                    .textContent()
            ).toContain(taskCreatedAt);
        });

        await test.step('Set task as complete by API and check it in UI', async () => {
            const taskData = (await completeTask({ authInstance, taskID }))
                .data;

            const { completedAt: taskCompletedAtData } = taskData;

            const [calendarDay, timeOfDay] = taskCompletedAtData.split('T');
            const [year, month, day] = calendarDay.split('-');
            const [hour, minutes] = timeOfDay.split(':');

            const taskCompletedAt = `${day}.${month}.${year} ${hour}:${minutes}`;

            await page.reload({ waitUntil: 'networkidle' });

            expect(
                await page
                    .locator('div[class*="rounded-md"]', {
                        has: page.locator('p', {
                            hasText: taskTitleEdit,
                        }),
                    })
                    .locator('p', { hasText: 'Completed at: ' })
                    .textContent()
            ).toContain(taskCompletedAt);
        });

        await test.step('Delete Task with API and check if it disapears from UI', async () => {
            await deleteTask({ authInstance, taskID: taskID });

            await page.reload({ waitUntil: 'networkidle' });

            await expect(
                page.locator('div[class*="rounded-md"]', {
                    has: page.locator('p', {
                        hasText: taskTitleEdit,
                    }),
                })
            ).toHaveCount(0);
        });
    });
});
