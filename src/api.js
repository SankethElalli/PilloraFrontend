let API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
  if (window.location.hostname === 'localhost') {
    API_BASE_URL = 'http://localhost:5000';
  } else {
    // If deployed, set this to your backend's public URL (update as needed)
    API_BASE_URL = 'https://pillorabackend.onrender.com'; // <-- CHANGE THIS to your backend URL
  }
}

export default API_BASE_URL;
