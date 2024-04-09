import axios from 'axios';
import * as types from '../types/index';
import * as config from '../config';

const { apiURL } = config;

export const createAuthInstance = async ({
    username,
    password,
}: types.CreateAuthinstance) => {
    const authInstance = axios.create({});
    authInstance.defaults.headers.common['Authorization'] = `Basic ${btoa(
        `${username}:${password}`
    )}`;
    authInstance.defaults.timeout = 90000;
    return authInstance;
};

export const createTask = async ({ authInstance, data }: types.CreateTask) => {
    try {
        return await authInstance({
            url: `${apiURL}/tasks`,
            method: 'POST',
            data,
        });
    } catch (e) {
        throw new Error(e);
    }
};

export const updateTask = async ({
    authInstance,
    data,
    taskID,
}: types.UpdateTask) => {
    try {
        return await authInstance({
            url: `${apiURL}/tasks/${taskID}`,
            method: 'PATCH',
            data,
        });
    } catch (e) {
        throw new Error(e);
    }
};

export const taskInfo = async ({ authInstance, taskID }: types.TaskInfo) => {
    try {
        return await authInstance({
            url: `${apiURL}/tasks/${taskID}`,
            method: 'GET',
        });
    } catch (e) {
        throw new Error(e);
    }
};

export const completeTask = async ({
    authInstance,
    taskID,
}: types.CompleteTask) => {
    try {
        return await authInstance({
            url: `${apiURL}/tasks/${taskID}/complete`,
            method: 'POST',
        });
    } catch (e) {
        throw new Error(e);
    }
};

export const getTasks = async ({ authInstance }: types.GetTasks) => {
    try {
        return await authInstance({
            url: `${apiURL}/tasks`,
            method: 'GET',
        });
    } catch (e) {
        throw new Error(e);
    }
};

export const deleteTask = async ({
    authInstance,
    taskID,
}: types.DeleteTask) => {
    try {
        return await authInstance({
            url: `${apiURL}/tasks/${taskID}`,
            method: 'DELETE',
        });
    } catch (e) {
        throw new Error(e);
    }
};
