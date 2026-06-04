import axios from 'axios';

async function seed() {
  try {
    console.log("Registering admin...");
    await axios.post('http://localhost:8080/api/v1/auth/register', {
      email: 'admin@stagefront.com',
      password: 'admin1234',
      displayName: 'Admin User'
    });
    console.log("Admin registered!");
  } catch (err) {
    console.log("Admin error:", err.response?.data || err.message);
  }

  try {
    console.log("Registering staff...");
    await axios.post('http://localhost:8080/api/v1/auth/register', {
      email: 'staff@stagefront.com',
      password: 'staff1234',
      displayName: 'Staff User'
    });
    console.log("Staff registered!");
  } catch (err) {
    console.log("Staff error:", err.response?.data || err.message);
  }
}

seed();
