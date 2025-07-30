import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 20 }, // Ramp up to 20 users
    { duration: '5m', target: 20 }, // Stay at 20 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests under 2s
    http_req_failed: ['rate<0.02'],    // Error rate under 2%
  },
};

const BASE_URL = 'http://localhost:3000';

export default function () {
  // Test dashboard page
  let response = http.get(`${BASE_URL}/dashboard`);
  check(response, {
    'dashboard page status is 200': (r) => r.status === 200,
    'dashboard loads within 2s': (r) => r.timings.duration < 2000,
  });

  sleep(1);

  // Test properties API
  response = http.get(`${BASE_URL}/api/properties?page=1&limit=20`);
  check(response, {
    'properties API status is 200': (r) => r.status === 200,
    'properties API response time < 1s': (r) => r.timings.duration < 1000,
    'properties API returns data': (r) => {
      const body = JSON.parse(r.body);
      return body.properties && body.properties.length > 0;
    },
  });

  sleep(1);

  // Test search with filters
  response = http.get(`${BASE_URL}/api/properties?city=Warszawa&minPrice=300000&maxPrice=600000`);
  check(response, {
    'filtered search status is 200': (r) => r.status === 200,
    'filtered search response time < 1.5s': (r) => r.timings.duration < 1500,
  });

  sleep(2);
}
