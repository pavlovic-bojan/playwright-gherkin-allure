@web
Feature: Add Item to Cart from Item Page
  As a problem user
  I want to add an item to cart from its detail page
  So that I can validate item addition functionality

  Scenario: Find item by name and add to cart from item page
    Given I am logged in as "problem_user"
    When I find item by name "Sauce Labs Backpack"
    And I add the item to cart from item page
    And I go to the cart
    Then the item "Sauce Labs Backpack" should be in the cart
