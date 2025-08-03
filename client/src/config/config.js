// Configuration for API endpoints
const config = {
  // Change this to your backend URL when deployed
  API_BASE_URL: process.env.NODE_ENV === 'production' 
    ? 'https://your-backend-url.herokuapp.com/api'  // Replace with your actual backend URL
    : 'http://localhost:5000/api',
    
  // For development
  DEV_API_URL: 'http://localhost:5000/api',
  
  // For production - update this with your actual backend URL
  PROD_API_URL: 'https://your-backend-url.herokuapp.com/api'
};

export default config;
