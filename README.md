# Career Prediction Frontend (React + TailwindCSS + Axios)

# 1. Install dependencies:
#    npm create vite@latest frontend -- --template react
#    cd frontend
#    npm install tailwindcss axios react-router-dom
#    npx tailwindcss init -p
#    (Configure Tailwind in tailwind.config.js and index.css)

# 2. Example: src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

export const signup = (data) => API.post('/auth/signup', data);
export const login = (data) => API.post('/auth/token', data);
export const predictCareer = (data, token) =>
  API.post('/predict-career', data, { headers: { Authorization: `Bearer ${token}` } });
export const getResults = (userId, token) =>
  API.get(`/results/${userId}`, { headers: { Authorization: `Bearer ${token}` } });
export const sendFeedback = (data, token) =>
  API.post('/feedback', data, { headers: { Authorization: `Bearer ${token}` } });

# 3. Example: src/components/Auth.js
import React, { useState } from 'react';
import { signup, login } from '../api';

function Auth({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      const res = await login({ username, password });
      setToken(res.data.access_token);
    } else {
      await signup({ username, password });
      setIsLogin(true);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4">
      <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Username" className="input" />
      <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" className="input" />
      <button type="submit" className="btn">{isLogin ? 'Login' : 'Sign Up'}</button>
      <button type="button" onClick={() => setIsLogin(!isLogin)} className="link">
        {isLogin ? 'Need an account?' : 'Have an account?'}
      </button>
    </form>
  );
}

export default Auth;

# 4. Example: src/components/SurveyForm.js
import React, { useState } from 'react';
import { predictCareer } from '../api';

function SurveyForm({ token, userId, onResult }) {
  const [form, setForm] = useState({ skills: '', education: '', interests: '', personality: '', goals: '' });
  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });
  const handleSubmit = async e => {
    e.preventDefault();
    const res = await predictCareer({ ...form, user_id: userId }, token);
    onResult(res.data);
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-4">
      {/* Inputs for skills, education, interests, personality, goals */}
      <button type="submit" className="btn">Get Career Suggestions</button>
    </form>
  );
}
export default SurveyForm;

# 5. Example: src/components/Dashboard.js
import React from 'react';

function Dashboard({ result }) {
  if (!result) return null;
  return (
    <div className="p-4">
      <h2>Top Careers</h2>
      {result.careers.map((c, i) => (
        <div key={i} className="card">{c.career} (Score: {c.score})</div>
      ))}
      <div><strong>Reasoning:</strong> {result.reasoning}</div>
      <div><strong>Roadmap:</strong> <ul>{result.roadmap.map((step, i) => <li key={i}>{step}</li>)}</ul></div>
    </div>
  );
}
export default Dashboard;
