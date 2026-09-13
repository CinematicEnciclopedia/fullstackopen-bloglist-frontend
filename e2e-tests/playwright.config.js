const { defineConfig, devices } = require('@playwright/test')
const path = require('path')

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry'
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ],
  webServer: [
    {
      command: 'npx cross-env NODE_ENV=test PORT=3001 npm start',
      url: 'http://localhost:3001/api/blogs',
      reuseExistingServer: false,
      timeout: 60000,
      cwd: path.resolve(__dirname, '..', '..', 'part4'),
      stdout: 'pipe'
    },
    {
      command: 'npm run dev -- --port 5173 --strictPort',
      url: 'http://localhost:5173',
      reuseExistingServer: false,
      timeout: 60000,
      cwd: path.resolve(__dirname, '..'),
      env: {
        VITE_API_URL: 'http://localhost:3001'
      },
      stdout: 'pipe'
    }
  ]
})
