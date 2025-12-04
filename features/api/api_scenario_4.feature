@api
Feature: Parametrized Delay Validation
  As an API consumer
  I want to test API response time with delay parameter
  So that I can validate performance

  Scenario Outline: Validate response time with delay parameter
    When I send a GET request to "/users" with delay "<delay>" seconds
    Then the response status should be 200
    And the response time should be less than "1" seconds

    Examples:
      | delay |
      | 0     |
      | 3     |
