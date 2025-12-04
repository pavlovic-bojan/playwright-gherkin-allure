/// <reference types='codeceptjs' />
import * as dotenv from 'dotenv';
import LoginPage from '../pages/LoginPage';
import ProductsPage from '../pages/ProductsPage';
import CartPage from '../pages/CartPage';
import CheckoutPage from '../pages/CheckoutPage';
import ItemPage from '../pages/ItemPage';

// Load environment variables
dotenv.config();

const { I } = inject() as { I: any };

// User credentials mapping - loaded from environment variables
const getPassword = () => process.env.PASSWORD || 'secret_sauce';

const USER_CREDENTIALS: { [key: string]: { username: string; password: string } } = {
  'standard_user': { 
    username: process.env.STANDARD_USER || 'standard_user', 
    password: getPassword() 
  },
  'locked_out_user': { 
    username: process.env.LOCKED_OUT_USER || 'locked_out_user', 
    password: getPassword() 
  },
  'problem_user': { 
    username: process.env.PROBLEM_USER || 'problem_user', 
    password: getPassword() 
  },
  'performance_glitch_user': { 
    username: process.env.PERFORMANCE_GLITCH_USER || 'performance_glitch_user', 
    password: getPassword() 
  },
  'error_user': { 
    username: process.env.ERROR_USER || 'error_user', 
    password: getPassword() 
  },
  'visual_user': { 
    username: process.env.VISUAL_USER || 'visual_user', 
    password: getPassword() 
  },
};

Given('I am logged in as {string}', async (userType: string) => {
  const credentials = USER_CREDENTIALS[userType];
  if (!credentials) {
    throw new Error(`Unknown user type: ${userType}`);
  }
  const loginPage = new LoginPage(I);
  await loginPage.login(credentials.username, credentials.password);
  // Wait for products page to load
  await I.waitForElement('[data-test="inventory-list"]', 10);
});

Given('I attempt to login as {string}', async (userType: string) => {
  const credentials = USER_CREDENTIALS[userType];
  if (!credentials) {
    throw new Error(`Unknown user type: ${userType}`);
  }
  const loginPage = new LoginPage(I);
  await loginPage.login(credentials.username, credentials.password);
});

When('I add all items to the cart', async () => {
  const productsPage = new ProductsPage(I);
  await productsPage.addAllItemsToCart();
});

When('I go to the cart', async () => {
  const productsPage = new ProductsPage(I);
  // Check cart badge count before going to cart (for debugging)
  const cartCount = await productsPage.getCartItemCount();
  console.log(`Cart has ${cartCount} item(s) before navigating to cart page`);
  
  await productsPage.goToCart();
  // Wait for cart page to fully load
  await I.waitForElement('[data-test="cart-list"]', 5);
  // Additional wait to ensure cart items are rendered
  await I.wait(1);
});

When('I remove the third item from the cart', async () => {
  const cartPage = new CartPage(I);
  await cartPage.removeThirdItem();
  // Wait a moment for the item to be removed
  await I.wait(1);
});

When('I proceed to checkout', async () => {
  const cartPage = new CartPage(I);
  await cartPage.proceedToCheckout();
  await I.waitForElement('#checkout_info_container', 5);
});

When('I fill checkout information with {string} {string} {string}', 
  async (firstName: string, lastName: string, postalCode: string) => {
    const checkoutPage = new CheckoutPage(I);
    await checkoutPage.fillCheckoutInfo(firstName, lastName, postalCode);
    await I.waitForElement('.summary_info', 5);
  }
);

When('I find item by name {string}', async (itemName: string) => {
  const productsPage = new ProductsPage(I);
  await productsPage.findItemByName(itemName);
  await I.waitForElement('.inventory_details', 5);
});

When('I add the item to cart from item page', async () => {
  const itemPage = new ItemPage(I);
  // Get item name before adding to cart
  const itemName = await itemPage.getItemName();
  console.log(`Adding item "${itemName}" to cart...`);
  
  await itemPage.addToCart();
  // Wait a bit to ensure cart state is updated
  await I.wait(1);
});

When('I sort products by {string}', async (sortOption: string) => {
  const productsPage = new ProductsPage(I);
  await productsPage.sortProducts(sortOption);
  await I.wait(1); // Wait for sort to complete
});

When('I finish the purchase', async () => {
  const checkoutPage = new CheckoutPage(I);
  await checkoutPage.finishPurchase();
  await I.waitForElement('.checkout_complete_container', 5);
});

Then('I should see only the remaining items in checkout overview', async () => {
  const checkoutPage = new CheckoutPage(I);
  const items = await checkoutPage.getCheckoutItems();
  // We expect 5 items (6 total - 1 removed = 5)
  if (items.length !== 5) {
    throw new Error(`Expected 5 items in checkout, but found ${items.length}`);
  }
});

Then('the total count of items should match the remaining items', async () => {
  const checkoutPage = new CheckoutPage(I);
  const itemCount = await checkoutPage.getCheckoutItemCount();
  // We expect 5 items after removing the third one
  if (itemCount !== 5) {
    throw new Error(`Expected 5 items, but found ${itemCount}`);
  }
});

Then('the website should confirm the order', async () => {
  const checkoutPage = new CheckoutPage(I);
  const isConfirmed = await checkoutPage.isOrderConfirmed();
  if (!isConfirmed) {
    throw new Error('Order confirmation was not displayed');
  }
  const message = await checkoutPage.getOrderConfirmationMessage();
  console.log(`Order confirmation message: ${message}`);
});

Then('the item {string} should be in the cart', async (itemName: string) => {
  const cartPage = new CartPage(I);
  // Wait for cart page to load - check if there are any items first
  try {
    await I.waitForElement('[data-test="cart-list"]', 5);
  } catch {
    throw new Error(`Cart page did not load properly`);
  }
  
  // Wait a bit more for items to appear
  await I.wait(1);
  
  const isInCart = await cartPage.isItemInCart(itemName);
  if (!isInCart) {
    // Get all items in cart for better error message
    try {
      const allItems = await cartPage.getCartItems();
      throw new Error(`Item "${itemName}" was not found in the cart. Available items: ${allItems.length > 0 ? allItems.join(', ') : 'Cart is empty'}`);
    } catch (error: any) {
      throw new Error(`Item "${itemName}" was not found in the cart. ${error.message || ''}`);
    }
  }
});

Then('the products should be sorted by name in ascending order', async () => {
  const productsPage = new ProductsPage(I);
  const isSorted = await productsPage.isProductSortedByName(true);
  if (!isSorted) {
    throw new Error('Products are not sorted by name in ascending order');
  }
});

Then('the login should fail', async () => {
  // Wait a bit for error to appear
  await I.wait(1);
  const loginPage = new LoginPage(I);
  const hasError = await loginPage.isErrorVisible();
  if (!hasError) {
    // Check if we're still on login page (login failed)
    const currentUrl = await I.grabCurrentUrl();
    if (!currentUrl.includes('inventory') && !currentUrl.includes('products')) {
      // We're still on login page, login failed
      return;
    }
    throw new Error('Login should have failed but no error message was displayed');
  }
});

Then('I should see an error message', async () => {
  const loginPage = new LoginPage(I);
  const errorMessage = await loginPage.getErrorMessage();
  console.log(`Login error message: ${errorMessage}`);
  if (!errorMessage || errorMessage.trim() === '') {
    throw new Error('Error message was not displayed');
  }
});

