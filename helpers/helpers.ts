import * as types from '../types/helpers';
import * as config from '../config';

const { baseURL } = config;

export const getTestID = () => {
    return Math.round(Math.random() * 10000000);
};

export const login = async ({ page, username, password }: types.Login) => {
    await page.locator('#username').fill(username);
    await page.locator('#password').fill(password);

    await Promise.all([
        page.locator('button').click(),
        page.waitForResponse(
            (response) =>
                response.url().includes('/auth/login') &&
                response.status() === 303
        ),
    ]);

    await page.waitForLoadState('networkidle');
};

export const clickTaskButton = async ({
    page,
    taskTitle,
    buttonType,
}: types.TaskButton) => {
    let buttonText: string;

    switch (buttonType) {
        case 'complete': {
            buttonText = 'Mark task as completed';
            break;
        }
        case 'edit': {
            buttonText = 'Edit task';
            break;
        }
        case 'delete': {
            buttonText = 'Delete task';
        }
    }
    await page
        .locator('div[class*="rounded-md"]', {
            has: page.locator('p', {
                hasText: taskTitle,
            }),
        })
        .locator('button', {
            has: page.locator(`text=${buttonText}`),
        })
        .click();
};
