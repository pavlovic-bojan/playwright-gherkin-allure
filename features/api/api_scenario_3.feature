@api
Feature: Update User
  As an API consumer
  I want to update a user
  So that I can validate update functionality

  Scenario: Update user and validate response
    When I update user "2" with name "Jane Doe" and job "QA Engineer"
    Then the response status should be 200
    And the response body should match the request body
