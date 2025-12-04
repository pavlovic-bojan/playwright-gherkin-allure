/// <reference types='codeceptjs' />
import { getByDataTest } from '../helpers/webHelper';

type I = any; // CodeceptJS actor interface

class ItemPage {
  private readonly itemName = getByDataTest('inventory-item-name');
  private readonly addToCartButton = 'button[data-test^="add-to-cart"]';
  private readonly removeFromCartButton = getByDataTest('remove');
  private readonly backButton = getByDataTest('back-to-products');

  async getItemName(): Promise<string> {
    const I = this.I;
    return await I.grabTextFrom(this.itemName);
  }

  async addToCart(): Promise<void> {
    const I = this.I;
    // Wait for button to be visible and clickable
    await I.waitForElement(this.addToCartButton, 5);
    await I.click(this.addToCartButton);
    // Wait for the click to be processed
    await I.wait(1);
    // Note: With problem_user, button might not change to "remove" due to a known bug
    // We'll verify if item was actually added by checking the cart page
  }
  
  // Expose selectors for step definitions
  get addToCartButtonSelector(): string {
    return this.addToCartButton;
  }
  
  get removeFromCartButtonSelector(): string {
    return this.removeFromCartButton;
  }

  async isItemAddedToCart(): Promise<boolean> {
    const I = this.I;
    try {
      await I.waitForElement(this.removeFromCartButton, 3);
      return await I.grabNumberOfVisibleElements(this.removeFromCartButton) > 0;
    } catch {
      return false;
    }
  }

  async goBack(): Promise<void> {
    const I = this.I;
    await I.click(this.backButton);
  }

  constructor(private I: I) {}
}

export = ItemPage;
