/// <reference types='codeceptjs' />

const { I } = inject() as { I: any };
declare const allure: any; // Allure reporter

let lastResponse: any;
let lastRequestBody: any;
let responseTime: number;

When('I send a GET request to {string}', async (endpoint: string) => {
  const startTime = Date.now();
  lastResponse = await I.sendGetRequest(endpoint);
  responseTime = Date.now() - startTime;
  console.log(`Response time: ${responseTime}ms`);
});

When('I send a GET request to {string} with delay {string} seconds', async (endpoint: string, delay: string) => {
  const startTime = Date.now();
  lastResponse = await I.sendGetRequest(`${endpoint}?delay=${delay}`);
  responseTime = Date.now() - startTime;
  console.log(`Response time with delay ${delay}s: ${responseTime}ms`);
});

When('I create a new user with name {string} and job {string}', 
  async (name: string, job: string) => {
    const requestBody = {
      name: name,
      job: job,
    };
    lastRequestBody = requestBody;
    const startTime = Date.now();
    lastResponse = await I.sendPostRequest('/users', requestBody);
    responseTime = Date.now() - startTime;
    console.log(`User creation response time: ${responseTime}ms`);
  }
);

When('I update user {string} with name {string} and job {string}',
  async (userId: string, name: string, job: string) => {
    const requestBody = {
      name: name,
      job: job,
    };
    lastRequestBody = requestBody;
    lastResponse = await I.sendPutRequest(`/users/${userId}`, requestBody);
  }
);

When('I attempt to login with email {string} and no password', async (email: string) => {
  const requestBody = {
    email: email,
    // password is intentionally omitted
  };
  lastResponse = await I.sendPostRequest('/login', requestBody);
});

Then('the response status should be {int}', async (expectedStatus: number) => {
  const actualStatus = lastResponse.status;
  if (actualStatus !== expectedStatus) {
    throw new Error(
      `Expected status ${expectedStatus}, but got ${actualStatus}. ` +
      `Response: ${JSON.stringify(lastResponse.data)}`
    );
  }
});

Then('I should print users with odd ID numbers', async () => {
  const users = lastResponse.data.data || [];
  const oddIdUsers = users.filter((user: any) => user.id % 2 !== 0);
  
  console.log('\n=== Users with Odd ID Numbers ===');
  oddIdUsers.forEach((user: any) => {
    console.log(`ID: ${user.id}, Name: ${user.first_name} ${user.last_name}, Email: ${user.email}`);
  });
  console.log(`Total users with odd IDs: ${oddIdUsers.length}\n`);
  
  // Also attach to Allure report
  if (typeof allure !== 'undefined') {
    allure.attachment('Odd ID Users', JSON.stringify(oddIdUsers, null, 2), 'application/json');
  }
});

Then('the creation date should be today', async () => {
  const createdAt = lastResponse.data.createdAt;
  if (!createdAt) {
    throw new Error('CreatedAt field is missing in response');
  }
  
  const createdDate = new Date(createdAt);
  const today = new Date();
  
  // Check if the date is today (ignoring time)
  const isToday = 
    createdDate.getFullYear() === today.getFullYear() &&
    createdDate.getMonth() === today.getMonth() &&
    createdDate.getDate() === today.getDate();
  
  if (!isToday) {
    throw new Error(
      `Expected creation date to be today, but got: ${createdDate.toISOString()}. ` +
      `Today is: ${today.toISOString()}`
    );
  }
  
  console.log(`User created at: ${createdAt}`);
});

Then('the response body should match the request body', async () => {
  // For PUT requests, the response should contain the updated fields
  // Note: reqres.in returns the updatedAt timestamp, so we check name and job match
  const responseData = lastResponse.data;
  
  if (!lastRequestBody) {
    throw new Error('Request body was not stored');
  }
  
  // Validate that response contains the same name and job as request
  if (responseData.name !== lastRequestBody.name) {
    throw new Error(
      `Name mismatch: expected "${lastRequestBody.name}", got "${responseData.name}"`
    );
  }
  
  if (responseData.job !== lastRequestBody.job) {
    throw new Error(
      `Job mismatch: expected "${lastRequestBody.job}", got "${responseData.job}"`
    );
  }
  
  if (!responseData.updatedAt) {
    throw new Error('Response body does not contain updatedAt field');
  }
  
  console.log(`✓ Response matches request: Name="${responseData.name}", Job="${responseData.job}"`);
  console.log(`Updated at: ${responseData.updatedAt}`);
});

Then('the response time should be less than {int} second', async (maxSeconds: number) => {
  const maxMilliseconds = maxSeconds * 1000;
  if (responseTime > maxMilliseconds) {
    throw new Error(
      `Response time ${responseTime}ms exceeds maximum allowed time ${maxMilliseconds}ms`
    );
  }
  console.log(`✓ Response time ${responseTime}ms is within limit of ${maxMilliseconds}ms`);
});

Then('the response time should be less than {string} seconds', async (maxSeconds: string) => {
  const maxSecondsNum = parseInt(maxSeconds, 10);
  const maxMilliseconds = maxSecondsNum * 1000;
  if (responseTime > maxMilliseconds) {
    throw new Error(
      `Response time ${responseTime}ms exceeds maximum allowed time ${maxMilliseconds}ms`
    );
  }
  console.log(`✓ Response time ${responseTime}ms is within limit of ${maxMilliseconds}ms`);
});

Then('the API login should fail', async () => {
  if (!lastResponse || !lastResponse.status) {
    throw new Error('No API response received');
  }
  const status = lastResponse.status;
  if (status < 400) {
    throw new Error(`Expected login to fail (status >= 400), but got status ${status}`);
  }
  
  const errorMessage = lastResponse.data.error || 'Unknown error';
  console.log(`Login failed as expected. Error: ${errorMessage}`);
});

