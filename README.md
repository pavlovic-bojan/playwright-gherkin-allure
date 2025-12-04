# Playwright + CodeceptJS + Gherkin + Allure Test Automation Framework

[![Latest Allure Report](https://img.shields.io/badge/Allure%20Report-Latest-blue)](https://pavlovic-bojan.github.io/playwright-gherkin-allure/)

This is a comprehensive test automation framework built with **CodeceptJS**, **Playwright**, **TypeScript**, **Gherkin**, and **Allure Reporting**. The framework includes both **Web UI** and **API** test automation suites.

📊 **Latest Allure Report**: [View Online](https://pavlovic-bojan.github.io/playwright-gherkin-allure/)

## 📋 Table of Contents

- [Overview](#overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [Running Tests](#running-tests)
- [Test Scenarios](#test-scenarios)
- [Allure Reports](#allure-reports)
- [CI/CD with GitHub Actions](#cicd-with-github-actions)
- [Approach & Design Decisions](#approach--design-decisions)

## 🎯 Overview

This framework implements test automation for:
- **Web UI Testing**: SauceDemo e-commerce website (https://www.saucedemo.com)
- **API Testing**: ReqRes API endpoints (https://reqres.in)

All tests are written using **Gherkin** syntax (BDD) and executed with **CodeceptJS** using **Playwright** as the browser automation engine.

## 🛠 Technology Stack

- **CodeceptJS** (v3.5.1): Test framework with BDD support
- **Playwright** (v1.40.0): Browser automation
- **TypeScript** (v5.3.3): Type-safe JavaScript
- **Gherkin**: BDD syntax for test scenarios
- **Allure Report**: Test reporting and visualization
- **REST Helper**: API testing capabilities

## 📁 Project Structure

```
playwright-gherkin-allure/
├── features/
│   ├── web/                    # Web UI test scenarios
│   │   ├── web_scenario_1.feature
│   │   ├── web_scenario_2.feature
│   │   ├── web_scenario_3.feature
│   │   └── web_scenario_4.feature
│   └── api/                    # API test scenarios
│       ├── api_scenario_1.feature
│       ├── api_scenario_2.feature
│       ├── api_scenario_3.feature
│       ├── api_scenario_4.feature
│       └── api_scenario_5.feature
├── step_definitions/           # Step definitions for Gherkin scenarios
│   ├── web_steps.ts
│   └── api_steps.ts
├── pages/                      # Page Object Model classes
│   ├── LoginPage.ts
│   ├── ProductsPage.ts
│   ├── CartPage.ts
│   ├── CheckoutPage.ts
│   └── ItemPage.ts
├── helpers/                    # Helper utilities
│   ├── webHelper.ts           # Web locator helpers
│   └── apiHelper.ts           # API helper functions
├── scripts/                    # Utility scripts
│   └── allure-serve.js        # Allure server wrapper for Windows
├── .github/                    # GitHub Actions workflows
│   └── workflows/
│       └── ci.yml             # CI/CD pipeline configuration
├── codecept.conf.ts            # CodeceptJS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── steps_file.ts              # CodeceptJS steps file
├── .env.example                # Example environment variables
├── .env                        # Environment variables (not in git)
└── README.md                   # This file
```

## 🚀 Installation

### Prerequisites

- **Node.js** (v16 or higher)
- **npm** (comes with Node.js)
- **Java JDK or JRE** (required for Allure Reports) - Download from [Adoptium](https://adoptium.net/) or [Oracle](https://www.oracle.com/java/technologies/downloads/)

### Step 1: Install Dependencies

```bash
npm install
```

This will install all required packages:
- CodeceptJS
- Playwright
- TypeScript
- Allure reporter
- dotenv (for environment variables)
- And their dependencies

### Step 1.5: Configure Environment Variables (Optional)

Copy the example environment file and customize if needed:

```bash
copy .env.example .env
```

The `.env` file contains configuration for:
- Web application URL
- API endpoint URL
- Browser settings
- Timeout values
- Test credentials

**Note:** The `.env` file is already configured with default values, so this step is optional. See [Environment Variables](#environment-variables) section for details.

### Step 2: Install Playwright Browsers

```bash
npx playwright install chromium
```

Or install all browsers:
```bash
npx playwright install
```

### Step 3: Install Java (Required for Allure Reports)

Allure Reports requires Java to generate HTML reports. Please install Java:

**Option 1: Install Java JDK (Recommended)**
- Download from: https://adoptium.net/ (OpenJDK - Recommended)
- Or from: https://www.oracle.com/java/technologies/downloads/
- Install and verify with: `java -version`

**Option 2: Verify Installation**
Check if Java is installed:
```bash
java -version
```

You should see output showing the Java version (e.g., `java 17.0.12` or `java 21.0.1`).

### Step 4: Allure Commandline

Allure commandline is already included as a dev dependency in this project. The framework uses `npx allure` commands or a custom wrapper script (`scripts/allure-serve.js`) that automatically handles the Allure JAR file.

**No additional installation is required!** The framework will work out of the box after installing dependencies.

If you prefer a global installation for system-wide access, you can install it separately, but it's not necessary for this project.

## 🔐 Environment Variables

All configuration is managed through environment variables. Copy `.env.example` to `.env` and customize as needed:

```bash
cp .env.example .env
```

### Available Environment Variables

#### Web Application Configuration
- `WEB_URL` - Web application URL (default: `https://www.saucedemo.com`)

#### API Configuration
- `API_URL` - API endpoint URL (default: `https://reqres.in/api`)

#### API Authentication (Optional)
- `API_KEY` - API key for authentication
- `API_TOKEN` - Bearer token for authentication (takes priority over API_KEY)
- `API_KEY_HEADER_NAME` - Custom header name for API key
- `API_KEY_HEADER` - Alternative variable to store API key value

#### Browser Configuration
- `BROWSER` - Browser to use: `chromium`, `firefox`, or `webkit` (default: `chromium`)
- `HEADED` - Run in headed mode: `true` or `false` (default: `false`)
- `HEADLESS` - Run in headless mode: `true` or `false` (default: `true`)

#### Timeout Configuration (milliseconds)
- `WAIT_FOR_TIMEOUT` - Default wait timeout (default: `10000`)
- `WAIT_FOR_ACTION` - Wait time between actions (default: `1000`)
- `TIMEOUT` - General timeout (default: `30000`)

#### Window Size
- `WINDOW_SIZE` - Browser window size (default: `1920x1080`)

#### Test User Credentials (for SauceDemo)
All users share the same password. These are test credentials and safe to commit.
- `STANDARD_USER` - Standard user username (default: `standard_user`)
- `PROBLEM_USER` - Problem user username (default: `problem_user`)
- `LOCKED_OUT_USER` - Locked out user username (default: `locked_out_user`)
- `PERFORMANCE_GLITCH_USER` - Performance glitch user username (default: `performance_glitch_user`)
- `ERROR_USER` - Error user username (default: `error_user`)
- `VISUAL_USER` - Visual user username (default: `visual_user`)
- `PASSWORD` - Password for all users (default: `secret_sauce`)

#### Allure Configuration
- `ALLURE_OUTPUT_DIR` - Directory for Allure results (default: `./output/allure`)

### Loading Environment Variables

The framework automatically loads environment variables from `.env` file using `dotenv`. All variables have default values, so creating `.env` is optional unless you need to override defaults.

## 🏃 Running Tests

### Run All Tests

```bash
npm test
```

### Run Only Web Tests

```bash
npm run test:web
```

### Run Only API Tests

```bash
npm run test:api
```

### Run Tests in Headed Mode (See Browser)

```bash
npm run test:headed
```

### Run Tests in Headless Mode (Default)

```bash
npm run test:headless
```

### Run All Tests with Allure Report

```bash
npm run test:all
```

This command will:
1. Run all tests
2. Generate Allure results
3. Start Allure server and open report in browser

### Run Web Tests with Report

```bash
npm run test:web:report
```

### Run API Tests with Report

```bash
npm run test:api:report
```

## 📊 Allure Reports

### View Latest Report Online

The latest Allure report from CI/CD pipeline is automatically deployed to GitHub Pages and available at:

🌐 **[https://pavlovic-bojan.github.io/playwright-gherkin-allure/](https://pavlovic-bojan.github.io/playwright-gherkin-allure/)**

This report is updated automatically after each successful workflow run on the `main` branch.

### Generate Allure Report Locally

After running tests locally, generate the Allure report:

```bash
npm run allure:generate
```

### Open Allure Report Locally

Open the generated report in your default browser:

```bash
npm run allure:open
```

### Serve Allure Report (Temporary Server)

Start a local server to view the report:

```bash
npm run allure:serve
```

The report will be available at `http://localhost:XXXX` (port will be shown in terminal).

**Note:** On Windows systems with paths containing spaces, the framework uses a custom wrapper script (`scripts/allure-serve.js`) to ensure Allure server starts correctly. This script automatically finds the Allure JAR file and handles path escaping.

## 📝 Test Scenarios

### Web UI Test Scenarios

#### Scenario 1: Complete Purchase Flow
- Login as standard user
- Add all items to cart
- Remove third item
- Complete checkout
- Validate order confirmation

#### Scenario 2: Add Item from Item Page
- Login as problem user
- Find item by name
- Add to cart from item detail page
- Validate item in cart

#### Scenario 3: Sort Products
- Login as standard user
- Sort products by name (A to Z)
- Validate sorting

#### Scenario 4: Login Validation
- Attempt login as locked_out_user
- Validate login failure and error message

### API Test Scenarios

#### Scenario 1: Get Users List
- Get list of users
- Validate success response
- Print users with odd ID numbers

#### Scenario 2: Create User
- Create new user
- Validate creation success
- Validate creation date is today

#### Scenario 3: Update User
- Update existing user
- Validate update success
- Validate response matches request body

#### Scenario 4: Parametrized Delay Test
- Test API with delay parameters (0 and 3 seconds)
- Validate response time < 1 second

#### Scenario 5: Login Validation
- Attempt login without password
- Validate login failure (400 status)

## 🚀 CI/CD with GitHub Actions

This project includes GitHub Actions workflows for continuous integration. The workflows automatically run tests on every push and pull request to `main` or `develop` branches.

### Available Workflows

The project includes three separate workflows located in `.github/workflows/`:

1. **Run All Tests** (`ci.yml`) - Runs both Web and API tests
   - Latest report: [https://pavlovic-bojan.github.io/playwright-gherkin-allure/](https://pavlovic-bojan.github.io/playwright-gherkin-allure/)

2. **Run Web Tests** (`ci-web.yml`) - Runs only Web UI tests
   - Latest report: [https://pavlovic-bojan.github.io/playwright-gherkin-allure/web/](https://pavlovic-bojan.github.io/playwright-gherkin-allure/web/)

3. **Run API Tests** (`ci-api.yml`) - Runs only API tests
   - Latest report: [https://pavlovic-bojan.github.io/playwright-gherkin-allure/api/](https://pavlovic-bojan.github.io/playwright-gherkin-allure/api/)

All workflows can be triggered manually via the GitHub Actions UI or automatically on push/PR.

### Workflow Configuration

Each workflow performs the following steps:

1. **Checkout Code** - Retrieves the latest code from repository
2. **Setup Node.js** - Installs Node.js 20 with npm caching
3. **Setup Java** - Installs Java 17 (required for Allure Reports)
4. **Install Dependencies** - Runs `npm ci` to install all dependencies
5. **Install Playwright Browsers** - Installs Chromium browser (Web tests only)
6. **Run Tests** - Executes tests with environment variables
7. **Generate Allure Report** - Creates Allure report from test results
8. **Upload Artifacts** - Uploads Allure report and test results as artifacts
9. **Deploy to GitHub Pages** - Automatically deploys report to GitHub Pages (main branch only)

### Environment Variables in CI/CD

The workflow uses GitHub Secrets for sensitive configuration. You can set these in your repository settings under **Settings → Secrets and variables → Actions**.

**Optional Secrets** (with defaults):
- `WEB_URL` (default: `https://www.saucedemo.com`)
- `API_URL` (default: `https://reqres.in/api`)
- `STANDARD_USER` (default: `standard_user`)
- `PROBLEM_USER` (default: `problem_user`)
- `LOCKED_OUT_USER` (default: `locked_out_user`)
- `PERFORMANCE_GLITCH_USER` (default: `performance_glitch_user`)
- `ERROR_USER` (default: `error_user`)
- `VISUAL_USER` (default: `visual_user`)
- `PASSWORD` (default: `secret_sauce`)
- `API_KEY` (optional)
- `API_TOKEN` (optional)

### Viewing CI/CD Results

After a workflow runs:

1. **View Report Online**: The latest Allure report is automatically deployed to GitHub Pages:
   - All Tests: [https://pavlovic-bojan.github.io/playwright-gherkin-allure/](https://pavlovic-bojan.github.io/playwright-gherkin-allure/)
   - Web Tests: [https://pavlovic-bojan.github.io/playwright-gherkin-allure/web/](https://pavlovic-bojan.github.io/playwright-gherkin-allure/web/)
   - API Tests: [https://pavlovic-bojan.github.io/playwright-gherkin-allure/api/](https://pavlovic-bojan.github.io/playwright-gherkin-allure/api/)

2. **Download Artifacts**: Go to the **Actions** tab in your GitHub repository:
   - Click on the workflow run to see details
   - Download **allure-report** artifact to view the Allure report locally
   - Download **test-results** artifact to see detailed test output

### Running CI/CD Locally

To test the CI/CD workflow locally, you can use [act](https://github.com/nektos/act):

```bash
act -j test
```

Or install dependencies and run tests manually:

```bash
npm ci
npx playwright install --with-deps chromium
npm test
```

## 🎨 Approach & Design Decisions

### Why CodeceptJS?

1. **BDD Support**: Native Gherkin support without additional setup
2. **Multiple Helpers**: Easy integration of Playwright and REST helpers
3. **Page Objects**: Built-in support for Page Object Model
4. **Allure Integration**: Seamless Allure reporting plugin
5. **TypeScript Support**: Full TypeScript support out of the box

### Why Page Object Model?

- **Maintainability**: Centralized element locators
- **Reusability**: Page methods can be reused across tests
- **DRY Principle**: No code duplication
- **Readability**: Clear separation of concerns

### Why Gherkin/BDD?

- **Readability**: Tests are readable by non-technical stakeholders
- **Documentation**: Feature files serve as living documentation
- **Collaboration**: Business analysts can write/validate scenarios
- **Maintainability**: Clear test intent and structure

### Why Allure Reporting?

- **Rich Reports**: Detailed test execution reports with screenshots
- **History**: Track test execution over time
- **Attachments**: Support for logs, screenshots, and custom data
- **Integration**: Easy CI/CD integration

### Framework Architecture

1. **Separation of Concerns**:
   - Feature files (Gherkin) define test scenarios
   - Step definitions map Gherkin steps to code
   - Page objects encapsulate page interactions
   - Configuration is centralized

2. **DRY Principle**:
   - Reusable page objects
   - Common step definitions
   - Centralized user credentials
   - Shared utilities

3. **Maintainability**:
   - TypeScript for type safety
   - Clear naming conventions
   - Modular structure
   - Comprehensive documentation

## 🔧 Configuration

### CodeceptJS Configuration (`codecept.conf.ts`)

- **Playwright Helper**: Configured for SauceDemo website
- **REST Helper**: Configured for ReqRes API
- **Allure Plugin**: Enabled for test reporting
- **Gherkin**: Configured to use feature files and step definitions

### Environment Variables

See [Environment Variables](#environment-variables) section for complete configuration options.

## 📸 Expected Test Results

After running tests, you should see:
- All scenarios passing (or failing with clear error messages)
- Allure report with detailed execution information
- Console output with test progress
- Screenshots and traces (if enabled)

## 🐛 Troubleshooting

### Issue: Tests fail with "browser not found"
**Solution**: Run `npx playwright install chromium`

### Issue: Allure report not generating
**Solution**: 
- Ensure Java is installed: `java -version`
- Ensure Allure commandline is installed via npm: `npm install --save-dev allure-commandline`
- On Windows with paths containing spaces, the custom wrapper script handles this automatically

### Issue: Allure serve not opening browser
**Solution**: The framework uses a custom wrapper script that handles path issues. If problems persist, use `npm run allure:generate && npm run allure:open` instead.

### Issue: TypeScript compilation errors
**Solution**: Run `npm install` to ensure all dependencies are installed

### Issue: Tests timeout
**Solution**: Increase timeout in `codecept.conf.ts` or check network connectivity

## 📚 Additional Resources

- [CodeceptJS Documentation](https://codecept.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Gherkin Syntax](https://cucumber.io/docs/gherkin/)
- [Allure Report Documentation](https://docs.qameta.io/allure/)

## 📄 License

ISC

---

**Note**: This framework follows best practices for test automation including Page Object Model, BDD approach, and comprehensive reporting. All code follows DRY principles and includes proper error handling and validation.

