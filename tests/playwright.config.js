import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: '.',
  use: { baseURL: 'http://127.0.0.1:4173/bobalabs/', launchOptions: process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {} },
  webServer: { cwd: '..', command: 'npm run dev -- --host 127.0.0.1 --port 4173', url: 'http://127.0.0.1:4173/bobalabs/', reuseExistingServer: !process.env.CI },
});
