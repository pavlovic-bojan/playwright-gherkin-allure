@api
Feature: Get List of Users
  As an API consumer
  I want to get a list of available users
  So that I can see users with odd ID numbers

  Scenario: Get users list and print odd ID users
    When I send a GET request to "/users"
    Then the response status should be 200
    And I should print users with odd ID numbers
