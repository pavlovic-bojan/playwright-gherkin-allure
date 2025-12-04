/// <reference types='codeceptjs' />
type I = typeof import('codeceptjs');

/**
 * Helper function to add API key to request headers
 * Can be used in step definitions when dynamic header addition is needed
 */
export function addApiKeyToHeaders(headers: Record<string, string> = {}): Record<string, string> {
  const apiKey = process.env.API_KEY;
  const apiToken = process.env.API_TOKEN;
  const apiKeyHeaderName = process.env.API_KEY_HEADER_NAME; // Name of the header
  const apiKeyHeaderValue = process.env.API_KEY_HEADER; // Value of the API key (if API_KEY not set)

  const result = { ...headers };

  // Priority: API_TOKEN > API_KEY with custom header name > API_KEY_HEADER as value > API_KEY with default header
  if (apiToken) {
    result['Authorization'] = `Bearer ${apiToken}`;
  } else if (apiKey) {
    if (apiKeyHeaderName) {
      // Use custom header name if provided
      result[apiKeyHeaderName] = apiKey;
    } else {
      // Use default header name
      result['X-API-Key'] = apiKey;
    }
  } else if (apiKeyHeaderValue) {
    // Use API_KEY_HEADER as API key value (fallback if API_KEY not set)
    const cleanValue = apiKeyHeaderValue.replace(/^['"]|['"]$/g, ''); // Remove quotes if present
    result['X-API-Key'] = cleanValue;
  }

  return result;
}

/**
 * Helper function to get API endpoint with optional path
 */
export function getApiEndpoint(path: string = ''): string {
  const baseUrl = process.env.API_URL || 'https://reqres.in/api';
  return path.startsWith('/') ? `${baseUrl}${path}` : `${baseUrl}/${path}`;
}
