import axios from 'axios';

// CONTACT AXIOS
export const contactAxios = axios.create({
  url: 'https://localhost/api/email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  }
});