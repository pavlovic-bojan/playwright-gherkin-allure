@api
Feature: Create New User
  As an API consumer
  I want to create a new user
  So that I can validate user creation

  Scenario: Create user and validate creation date
    When I create a new user with name "John Doe" and job "Software Engineer"
    Then the response status should be 201
    And the creation date should be today
