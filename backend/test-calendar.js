// Test Google Calendar Integration

const baseURL = 'http://localhost:3001/api/calendar';

// Test endpoints
const tests = [
  {
    name: 'Get Auth Status',
    url: `${baseURL}/auth/status`,
    method: 'GET'
  },
  {
    name: 'Get Auth URL',
    url: `${baseURL}/auth/url`,
    method: 'GET'
  }
];

async function runTests() {
  console.log('🧪 Testing Google Calendar Integration...\n');
  
  for (const test of tests) {
    try {
      console.log(`Testing: ${test.name}`);
      const response = await fetch(test.url);
      const data = await response.json();
      
      if (response.ok) {
        console.log('✅ Success:', JSON.stringify(data, null, 2));
      } else {
        console.log('❌ Error:', JSON.stringify(data, null, 2));
      }
    } catch (error) {
      console.log('❌ Network Error:', error.message);
    }
    console.log('---');
  }
}

// For Node.js
if (typeof require !== 'undefined') {
  const fetch = require('node-fetch');
  runTests();
}

module.exports = { runTests };
