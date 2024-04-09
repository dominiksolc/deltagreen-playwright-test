import * as config from './config';
import { createAuthInstance, deleteTask, getTasks } from './helpers/api';

const { username, password } = config;

async function tasksCleanup() {
    const authInstance = await createAuthInstance({ username, password });
    const tasksData = (await getTasks({ authInstance })).data;

    const tasksToDelete = tasksData.records.map((taskData: { id: string }) => {
        return deleteTask({ authInstance, taskID: taskData.id });
    });

    await Promise.all(tasksToDelete);
}

export default tasksCleanup;
