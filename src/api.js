import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = ({ username, password }) => {
  const params = new URLSearchParams();
  params.append('username', username);
  params.append('password', password);
  return API.post('/auth/token', params, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });
};
export const predictCareer = (data, token) =>
  API.post('/predict-career-content-based', data, { headers: { Authorization: `Bearer ${token}` } });
export const getResults = (userId, token) =>
  API.get(`/results/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
export const sendFeedback = (data, token) =>
  API.post('/feedback', data, { headers: { Authorization: `Bearer ${token}` } });
