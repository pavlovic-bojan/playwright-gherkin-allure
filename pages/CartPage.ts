/// <reference types='codeceptjs' />
import { getByDataTest } from '../helpers/webHelper';

type I = any; // CodeceptJS actor interface

class CartPage {
  private readonly cartItem = getByDataTest('inventory-item');
  private readonly cartItemName = getByDataTest('inventory-item-name');
  private readonly removeButton = 'button[data-test^="remove"]';
  private readonly checkoutButton = getByDataTest('checkout');
  private readonly continueShoppingButton = getByDataTest('continue-shopping');
  private readonly cartList = getByDataTest('cart-list');
  private readonly cartContentsContainer = getByDataTest('cart-contents-container');

  async getCartItems(): Promise<string[]> {
    const I = this.I;
    return await I.grabTextFromAll(this.cartItemName);
  }

  async getCartItemCount(): Promise<number> {
    const I = this.I;
    return await I.grabNumberOfVisibleElements(this.cartItem);
  }

  async removeItemByIndex(index: number): Promise<void> {
    const I = this.I;
    // Index is 1-based for user understanding
    const removeButtons = await I.grabNumberOfVisibleElements(this.removeButton);
    if (index > 0 && index <= removeButtons) {
      // Get all remove button data-test attributes and click by index
      const buttonDataTests = await I.grabAttributeFromAll(this.removeButton, 'data-test');
      if (buttonDataTests[index - 1]) {
        await I.click(getByDataTest(buttonDataTests[index - 1]));
      } else {
        throw new Error(`Invalid index: ${index}. Available items: ${removeButtons}`);
      }
    } else {
      throw new Error(`Invalid index: ${index}. Available items: ${removeButtons}`);
    }
  }

  async removeThirdItem(): Promise<void> {
    await this.removeItemByIndex(3);
  }

  async isItemInCart(itemName: string): Promise<boolean> {
    const I = this.I;
    // Wait for cart items to be visible
    try {
      await I.waitForElement(this.cartItemName, 3);
    } catch {
      // No items in cart yet
      return false;
    }
    const items = await this.getCartItems();
    return items.includes(itemName);
  }
  
  // Expose selector for step definitions
  get cartItemNameSelector(): string {
    return this.cartItemName;
  }

  async proceedToCheckout(): Promise<void> {
    const I = this.I;
    await I.click(this.checkoutButton);
  }

  constructor(private I: I) {}
}

export = CartPage;
