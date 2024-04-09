const baseURL = 'https://todos.dev.deltagreen.cz/';
const apiURL = 'https://todos.dev.deltagreen.cz/api';
const username = process.env.TEST_USERNAME
    ? process.env.TEST_USERNAME
    : 'dg-test';
const password = process.env.TEST_PASSWORD
    ? process.env.TEST_PASSWORD
    : 'xxyyzz112233';

export { baseURL, apiURL, username, password };
