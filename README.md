# How to setup project

1. Make sure you are in this project's folder
2. Install NodeJS if you not have it already (check with `node -v` and `npm -v`)
3. Install Yarn, if you not have it already, with command `npm install --global yarn`
4. Type `yarn install`
5. Install Playwright with command `yarn create Playwright`
    - The installation will pop up 5 questions in command line, all 5 should be answered with ENTER press

# Project structure

-   Tests are divided into 3 groups under the 'tests' folder: Registration related tests, Task related tests and User related tests.
-   Helpers folder includes files with functions and APIs that tests use
-   Types folder includes files with types for helper folder and offers importing 1 index file for all types

# How to run tests

### All tests through all web browsers

-   `yarn test`
-   All tests will as much run pararelly (depending on availaible workers) as it will be possible
-   Tests will run on Chromium, Webkit and Firefox

### All tests only on one browser

-   `yarn test --project <chromium|firefox|webkit>`
-   By adding `--project` variable, you can choose on which browser you want tests tu be run on

### Other ways

-   For other ways to run tests, check [official Playwright documentation](https://playwright.dev/docs/running-tests)
