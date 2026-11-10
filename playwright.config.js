import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./e2e',
 timeout:60000,
 expect:{timeout:15000},
 use:{baseURL:'http://127.0.0.1:4173',browserName:'chromium'},
 webServer:{command:'npm run dev -- --host 127.0.0.1 --port 4173',url:'http://127.0.0.1:4173',reuseExistingServer:!process.env.CI,timeout:60000},
 retries:process.env.CI?1:0
});
