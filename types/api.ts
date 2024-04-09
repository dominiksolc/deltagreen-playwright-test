import { AxiosInstance } from 'axios';

export type CreateAuthinstance = {
    username: string;
    password: string;
};

export type CreateTask = {
    authInstance: AxiosInstance;
    data: {
        name: string;
        description: string;
    };
};

export type UpdateTask = {
    authInstance: AxiosInstance;
    data: {
        name: string;
        description?: string;
    };
    taskID: string;
};

export type GetTasks = {
    authInstance: AxiosInstance;
};

export type TaskInfo = {
    authInstance: AxiosInstance;
    taskID: string;
};

export type CompleteTask = {
    authInstance: AxiosInstance;
    taskID: string;
};

export type DeleteTask = {
    authInstance: AxiosInstance;
    taskID: string;
};
