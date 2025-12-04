@web
Feature: Login Validation
  As a locked out user
  I want to attempt login
  So that I can see the error message

  Scenario: Validate login failure for locked out user
    Given I attempt to login as "locked_out_user"
    Then the login should fail
    And I should see an error message
