const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');

const API_URL = 'http://172.20.0.119:5000/api';
const TEST_EMAIL = 'a@a.a';
const TEST_PASSWORD = 'a';

async function login() {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD
    });
    return response.data.token;
  } catch (error) {
    console.error('Login failed:', error.response.data);
    throw error;
  }
}

async function updateProfilePic(token) {
  const form = new FormData();
  form.append('profilepic', fs.createReadStream('./test-profile-pic.jpg'));

  try {
    const response = await axios.put(`${API_URL}/user/${TEST_EMAIL}/profilepic`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Profile picture updated:', response.data);
  } catch (error) {
    console.error('Failed to update profile picture:', error.response.data);
  }
}

async function updateBannerPic(token) {
  const form = new FormData();
  form.append('bannerpic', fs.createReadStream('./test-banner-pic.jpg'));

  try {
    const response = await axios.put(`${API_URL}/user/${TEST_EMAIL}/bannerpic`, form, {
      headers: {
        ...form.getHeaders(),
        'Authorization': `Bearer ${token}`
      }
    });
    console.log('Banner picture updated:', response.data);
  } catch (error) {
    console.error('Failed to update banner picture:', error.response.data);
  }
}

async function updateUsername(token) {
  try {
    const response = await axios.put(`${API_URL}/user/${TEST_EMAIL}/username`, 
      { username: 'NewTestUsername' },
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    console.log('Username updated:', response.data);
  } catch (error) {
    console.error('Failed to update username:', error.response.data);
  }
}

async function testProfileUpdates() {
  try {
    const token = await login();
    await updateProfilePic(token);
    await updateBannerPic(token);
    await updateUsername(token);
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testProfileUpdates();