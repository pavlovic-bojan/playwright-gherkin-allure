import * as dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config: CodeceptJS.MainConfig = {
  tests: './features/**/*.feature',
  output: './output',
  helpers: {
    Playwright: {
      url: process.env.WEB_URL || 'https://www.saucedemo.com',
      show: process.env.HEADED === 'true',
      browser: (process.env.BROWSER as 'chromium' | 'firefox' | 'webkit') || 'chromium',
      waitForTimeout: parseInt(process.env.WAIT_FOR_TIMEOUT || '10000', 10),
      waitForAction: parseInt(process.env.WAIT_FOR_ACTION || '1000', 10),
      timeout: parseInt(process.env.TIMEOUT || '30000', 10),
      windowSize: process.env.WINDOW_SIZE || '1920x1080',
      video: false,
      trace: false,
    },
    REST: {
      endpoint: process.env.API_URL || 'https://reqres.in/api',
      timeout: parseInt(process.env.TIMEOUT || '10000', 10),
      defaultHeaders: (() => {
        const headers: Record<string, string> = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        };

        // Priority 1: Use Bearer token if API_TOKEN is provided
        if (process.env.API_TOKEN) {
          headers['Authorization'] = `Bearer ${process.env.API_TOKEN}`;
        }
        // Priority 2: Use API_KEY with custom header name if both are provided
        else if (process.env.API_KEY && process.env.API_KEY_HEADER_NAME) {
          headers[process.env.API_KEY_HEADER_NAME] = process.env.API_KEY;
        }
        // Priority 3: Use API_KEY_HEADER as API key value (if API_KEY not set)
        // This allows using API_KEY_HEADER variable name to store the API key value
        else if (process.env.API_KEY_HEADER && !process.env.API_KEY) {
          const apiKeyValue = process.env.API_KEY_HEADER.replace(/^['"]|['"]$/g, ''); // Remove quotes if present
          headers['X-API-Key'] = apiKeyValue;
        }
        // Priority 4: Use API_KEY with default X-API-Key header
        else if (process.env.API_KEY) {
          headers['X-API-Key'] = process.env.API_KEY;
        }

        return headers;
      })(),
    },
  },
  include: {
    I: './steps_file.ts',
    LoginPage: './pages/LoginPage.ts',
    ProductsPage: './pages/ProductsPage.ts',
    CartPage: './pages/CartPage.ts',
    CheckoutPage: './pages/CheckoutPage.ts',
    ItemPage: './pages/ItemPage.ts',
  },
  plugins: {
    allure: {
      enabled: true,
      require: '@codeceptjs/allure-legacy',
      outputDir: process.env.ALLURE_OUTPUT_DIR || './output/allure',
    },
    stepByStepReport: {
      enabled: false,
    },
  },
  gherkin: {
    features: './features/**/*.feature',
    steps: [
      './step_definitions/web_steps.ts',
      './step_definitions/api_steps.ts'
    ],
  },
  name: 'playwright-gherkin-allure',
};
