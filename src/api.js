let API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE_URL) {
  if (window.location.hostname === 'localhost') {
    API_BASE_URL = 'http://localhost:5000';
  } else {
    API_BASE_URL = 'https://pillorabackend.onrender.com';
  }
}

export default API_BASE_URL;
