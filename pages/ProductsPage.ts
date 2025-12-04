/// <reference types='codeceptjs' />
import { getByDataTest } from '../helpers/webHelper';

type I = any; // CodeceptJS actor interface

class ProductsPage {
  private readonly productItem = getByDataTest('inventory-item');
  private readonly productName = getByDataTest('inventory-item-name');
  private readonly addToCartButton = 'button[data-test^="add-to-cart"]'; // Matches all buttons starting with "add-to-cart"
  private readonly cartBadge = getByDataTest('shopping-cart-badge');
  private readonly cartIcon = getByDataTest('shopping-cart-link');
  private readonly sortDropdown = getByDataTest('product-sort-container');
  private readonly productNames = getByDataTest('inventory-item-name');

  async addAllItemsToCart(): Promise<void> {
    const I = this.I;
    // Wait for products to load
    await I.waitForElement(this.productItem, 10);
    // Get all add to cart button data-test attributes
    const buttonDataTests = await I.grabAttributeFromAll(this.addToCartButton, 'data-test');
    // Click each button by its data-test attribute
    for (const dataTest of buttonDataTests) {
      if (dataTest) {
        await I.click(getByDataTest(dataTest));
        await I.wait(0.1); // Small delay to ensure click is processed
      }
    }
  }

  async getCartItemCount(): Promise<number> {
    const I = this.I;
    try {
      // Check if badge exists first (it won't exist if cart is empty)
      const badgeExists = await I.grabNumberOfVisibleElements(this.cartBadge);
      if (badgeExists === 0) {
        return 0; // Cart is empty
      }
      // Badge exists, try to read the count
      const count = await I.grabTextFrom(this.cartBadge);
      return parseInt(count, 10) || 0;
    } catch {
      return 0; // If any error, assume cart is empty
    }
  }

  async goToCart(): Promise<void> {
    const I = this.I;
    await I.click(this.cartIcon);
  }

  async findItemByName(itemName: string): Promise<void> {
    const I = this.I;
    await I.click(`text=${itemName}`);
  }

  async sortProducts(sortOption: string): Promise<void> {
    const I = this.I;
    await I.selectOption(this.sortDropdown, sortOption);
  }

  async getProductNames(): Promise<string[]> {
    const I = this.I;
    return await I.grabTextFromAll(this.productNames);
  }

  async isProductSortedByName(ascending: boolean = true): Promise<boolean> {
    const I = this.I;
    const names = await this.getProductNames();
    const sorted = [...names].sort((a, b) => 
      ascending ? a.localeCompare(b) : b.localeCompare(a)
    );
    return JSON.stringify(names) === JSON.stringify(sorted);
  }

  constructor(private I: I) {}
}

export = ProductsPage;
