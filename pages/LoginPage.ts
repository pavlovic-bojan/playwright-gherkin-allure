/// <reference types='codeceptjs' />
import { getByDataTest } from '../helpers/webHelper';

type I = any; // CodeceptJS actor interface

class LoginPage {
  // Using helper methods for cleaner code
  private readonly usernameInput = getByDataTest('username');
  private readonly passwordInput = getByDataTest('password');
  private readonly loginButton = getByDataTest('login-button');
  private readonly errorMessage = getByDataTest('error');

  async login(username: string, password: string): Promise<void> {
    const I = this.I;
    // Navigate to login page
    await I.amOnPage('/');
    // Wait for login page to load
    await I.waitForElement(this.usernameInput, 10);
    await I.waitForElement(this.passwordInput, 10);
    await I.waitForElement(this.loginButton, 10);
    // Fill login form
    await I.fillField(this.usernameInput, username);
    await I.fillField(this.passwordInput, password);
    await I.click(this.loginButton);
    // Wait a bit for login to process (or error to appear)
    await I.wait(1);
  }

  async isErrorVisible(): Promise<boolean> {
    const I = this.I;
    try {
      await I.waitForElement(this.errorMessage, 5);
      return await I.grabNumberOfVisibleElements(this.errorMessage) > 0;
    } catch {
      return false;
    }
  }

  async getErrorMessage(): Promise<string> {
    const I = this.I;
    return await I.grabTextFrom(this.errorMessage);
  }

  constructor(private I: I) {}
}

export = LoginPage;
