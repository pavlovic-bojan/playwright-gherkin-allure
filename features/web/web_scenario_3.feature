@web
Feature: Sort Products
  As a standard user
  I want to sort products by name
  So that I can view products in alphabetical order

  Scenario: Sort products by name and validate
    Given I am logged in as "standard_user"
    When I sort products by "Name (A to Z)"
    Then the products should be sorted by name in ascending order
