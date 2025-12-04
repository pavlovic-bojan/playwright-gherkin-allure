@api
Feature: Login Validation
  As an API consumer
  I want to attempt login without password
  So that I can validate error handling

  Scenario: Login without password should fail
    When I attempt to login with email "eve.holt@reqres.in" and no password
    Then the response status should be 400
    And the API login should fail
