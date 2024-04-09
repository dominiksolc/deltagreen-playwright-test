import { Page } from '@playwright/test';

export type Login = {
    page: Page;
    username: string;
    password: string;
};

export type TaskButton = {
    page: Page;
    taskTitle: string;
    buttonType: 'complete' | 'edit' | 'delete';
};
