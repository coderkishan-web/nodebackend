const axios = require('axios');

const BASE_URL = 'http://localhost:5000';

async function testApi() {
    try {
        console.log('--- Testing API ---');

        // 1. Health Check
        try {
            const res = await axios.get(`${BASE_URL}/`);
            console.log('✅ Health Check Passed:', res.data);
        } catch (err) {
            console.error('❌ Health Check Failed:', err.message);
            return;
        }

        // 2. Register Test User
        const testUser = {
            name: 'Test API User',
            email: `test_api_${Date.now()}@example.com`,
            password: 'password123',
            role: 'admin'
        };

        let token = '';

        try {
            console.log(`\nAttempting to register user: ${testUser.email}`);
            const regRes = await axios.post(`${BASE_URL}/api/auth/register`, testUser);
            console.log('✅ Registration Passed:', regRes.data);
        } catch (err) {
            if (err.response && err.response.status === 400 && err.response.data.message === 'User already exists') {
                console.log('⚠️ User already exists, proceeding to login...');
            } else {
                console.error('❌ Registration Failed:', err.response ? err.response.data : err.message);
            }
        }

        // 3. Login
        try {
            console.log('\nAttempting to login...');
            const loginRes = await axios.post(`${BASE_URL}/api/auth/login`, {
                email: testUser.email,
                password: testUser.password
            });
            console.log('✅ Login Passed. Token received.');
            token = loginRes.data.token;
        } catch (err) {
            console.error('❌ Login Failed:', err.response ? err.response.data : err.message);
            return;
        }

        // 4. Access Protected Route (Clients)
        try {
            console.log('\nAttempting to fetch clients (Protected Route)...');
            const clientsRes = await axios.get(`${BASE_URL}/api/clients`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log(`✅ Fetch Clients Passed. Got ${clientsRes.data.length} clients.`);
        } catch (err) {
            console.error('❌ Fetch Clients Failed:', err.response ? err.response.data : err.message);
        }

        // 5. Access Dashboard Stats
        try {
            console.log('\nAttempting to fetch dashboard stats (Protected Route)...');
            const statsRes = await axios.get(`${BASE_URL}/api/dashboard/stats`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('✅ Dashboard Stats Passed:', statsRes.data);
        } catch (err) {
            console.error('❌ Dashboard Stats Failed:', err.response ? err.response.data : err.message);
        }

    } catch (err) {
        console.error('Unexpected Error:', err);
    }
}

testApi();
