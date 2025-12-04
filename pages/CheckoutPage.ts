/// <reference types='codeceptjs' />
import { getByDataTest } from '../helpers/webHelper';

type I = any; // CodeceptJS actor interface

class CheckoutPage {
  private readonly firstNameInput = getByDataTest('firstName');
  private readonly lastNameInput = getByDataTest('lastName');
  private readonly postalCodeInput = getByDataTest('postalCode');
  private readonly continueButton = getByDataTest('continue');
  private readonly finishButton = getByDataTest('finish');
  private readonly checkoutItem = getByDataTest('inventory-item');
  private readonly checkoutItemName = getByDataTest('inventory-item-name');
  private readonly summarySubtotal = '.summary_subtotal_label'; // No data-test available
  private readonly summaryTotal = '.summary_total_label'; // No data-test available
  private readonly completeHeader = '.complete-header'; // No data-test available
  private readonly completeText = '.complete-text'; // No data-test available
  private readonly cancelButton = getByDataTest('cancel');

  async fillCheckoutInfo(firstName: string, lastName: string, postalCode: string): Promise<void> {
    const I = this.I;
    await I.fillField(this.firstNameInput, firstName);
    await I.fillField(this.lastNameInput, lastName);
    await I.fillField(this.postalCodeInput, postalCode);
    await I.click(this.continueButton);
  }

  async getCheckoutItems(): Promise<string[]> {
    const I = this.I;
    return await I.grabTextFromAll(this.checkoutItemName);
  }

  async getCheckoutItemCount(): Promise<number> {
    const I = this.I;
    return await I.grabNumberOfVisibleElements(this.checkoutItem);
  }

  async finishPurchase(): Promise<void> {
    const I = this.I;
    await I.click(this.finishButton);
  }

  async isOrderConfirmed(): Promise<boolean> {
    const I = this.I;
    try {
      await I.waitForElement(this.completeHeader, 5);
      const headerText = await I.grabTextFrom(this.completeHeader);
      return headerText.includes('Thank you');
    } catch {
      return false;
    }
  }

  async getOrderConfirmationMessage(): Promise<string> {
    const I = this.I;
    return await I.grabTextFrom(this.completeHeader);
  }

  constructor(private I: I) {}
}

export = CheckoutPage;
