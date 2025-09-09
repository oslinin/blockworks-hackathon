based on
https://github.com/Cyfrin/ts-tsender-ui-cu

pnpm add -D @synthetixio/synpress

pnpm create playwright@latest

This will prompt you for configuration choices:
Tests Location: Change the default tests directory to test. Synpress typically expects tests to reside in a test directory by default.

    GitHub Actions: Select false for now. We won't configure CI/CD pipelines in this lesson.

    Install Browsers: Select true. Playwright needs the browser binaries (Chromium, Firefox, WebKit) to execute tests.

Configure Playwright (playwright.config.ts): Modify the generated playwright.config.ts file for our project needs.

    baseURL: Uncomment this option and set it to your local development server address (http://127.0.0.1:3000). This allows tests to use relative paths like page.goto('/'), making them more maintainable.

    projects: For faster test execution during development and demonstration, comment out the firefox and webkit projects. We'll focus on Chromium.

    webServer: Uncomment and configure this section. This crucial setting tells Playwright to automatically start your development server (pnpm run dev) before running tests and ensures it waits until the server is ready at the specified URL. Set reuseExistingServer: true to avoid restarting the server if one is already running.

pnpm synpress

this will run, and print an address:

Triggering cache creation for: 532f685e346606c2a803

then run

pnpm exec playwright test

this will fail. Rename .cache-synpress/address with the address above and retry. it will succeed

for a GUI:

pnpm exec playwright test --ui
