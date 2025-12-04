/**
 * Web Helper - Utility functions for web automation
 */

/**
 * Get CSS selector for element with data-test attribute
 * @param testId - The value of data-test attribute
 * @returns CSS selector string
 * 
 * @example
 * getByDataTest('username') // returns '[data-test="username"]'
 */
export function getByDataTest(testId: string): string {
  return `[data-test="${testId}"]`;
}
