

# CareerSync: AI-Powered Career Prediction Platform

CareerSync is a modern, fullstack web application that helps users discover and plan their ideal career paths. It features a vibrant, professional UI, AI-driven career suggestions, secure authentication, and persistent user storage—all with a focus on usability and branding.

---

## Features

- **AI-Powered Career Prediction:** Personalized career suggestions based on your skills, interests, education, and goals.
- **Roadmap Generation:** Step-by-step roadmaps for your top career matches.
- **Favorites:** Save and manage your favorite careers for quick access.
- **User Authentication:** Secure login/signup with JWT-based authentication.
- **Survey History:** Track your previous career prediction results.
- **Modern UI:** Vibrant, wide, and responsive design with dark mode support.
- **Branding:** Custom logo, tagline, and professional look ("CareerSync: Your Path, Your Future").

---

## Tech Stack

- **Frontend:** React (Vite), TailwindCSS, Axios
- **Backend:** FastAPI, Uvicorn, Python
- **Storage:** JSON files for user data and survey history (easy to swap for a database)
- **Authentication:** JWT (JSON Web Tokens)

---

## Project Structure

```
frontend/           # React app (UI)
   src/
      App.jsx         # Main app and navigation
      Dashboard.jsx   # Dashboard with career suggestions, favorites, etc.
      Auth.jsx        # Login/Signup page
      SurveyForm.jsx  # Survey for user input
      api.js          # Axios API calls
      ...
   public/
      logo.svg        # App logo
backend/            # FastAPI backend
   main.py           # API endpoints
   users.json        # User data storage
   ...
```

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- Python 3.8+

### 1. Clone the Repository
```sh
git clone https://github.com/BSRohit20/Careersync.git
cd Careersync
```

### 2. Backend Setup
```sh
cd backend
pip install -r requirements.txt
# Or manually:
pip install fastapi uvicorn
uvicorn main:app --reload
```

### 3. Frontend Setup
```sh
cd frontend
npm install
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:8000

---

## Example Code

### src/api.js
```js
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
```

### src/components/Auth.js
```js
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
```

### src/components/SurveyForm.js
```js
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
```

### src/components/Dashboard.js
```js
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
```

---

## Customization
- **Branding:** Update `public/logo.svg` and tagline in `App.jsx`/`Auth.jsx`.
- **Survey Questions:** Edit the survey logic in the frontend and backend as needed.
- **Storage:** For production, replace JSON storage with a database (e.g., PostgreSQL).

---

## Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---


## Contact
- Project by [BSRohit20](https://github.com/BSRohit20)
- For issues, use the GitHub Issues tab.
