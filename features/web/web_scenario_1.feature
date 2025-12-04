@web
Feature: Complete Purchase Flow
  As a standard user
  I want to add items to cart, remove one, and complete purchase
  So that I can validate the checkout process

  Scenario: Add all items, remove third item, and complete purchase
    Given I am logged in as "standard_user"
    When I add all items to the cart
    And I go to the cart
    And I remove the third item from the cart
    And I proceed to checkout
    And I fill checkout information with "John" "Doe" "12345"
    Then I should see only the remaining items in checkout overview
    And the total count of items should match the remaining items
    When I finish the purchase
    Then the website should confirm the order
