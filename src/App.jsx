
import FloatingHelpButton from './FloatingHelpButton';
import React, { useState, useEffect } from 'react';
import Auth from './Auth';
import SurveyForm from './SurveyForm';
import Dashboard from './Dashboard';
// import FeedbackForm from './FeedbackForm';
import Profile from './Profile';
// import Forum from './Forum';
// import CareerCompare from './CareerCompare';


function NavBar({ userId, onLogout, onProfile, onDashboard, activePage, darkMode, setDarkMode }) {
  return (
    <nav className={`w-full ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600'} shadow-lg py-3 px-6 flex items-center justify-between z-30 font-sans`}>
      {/* Left: Dark mode toggle */}
      <div className="flex items-center gap-2 flex-1">
        <button
          onClick={() => { setDarkMode(!darkMode); localStorage.setItem('darkMode', !darkMode); }}
          className="text-white text-xl bg-black bg-opacity-20 hover:bg-opacity-40 rounded-full w-10 h-10 flex items-center justify-center transition"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '🌙' : '☀️'}
        </button>
      </div>
      {/* Center: Logo, name, tagline */}
      <div className="flex flex-col items-center flex-1">
        <div className="flex items-center gap-2">
          <img src="/logo.svg" alt="CareerSync Logo" className="w-9 h-9 rounded-full shadow" />
          <span className="text-white font-extrabold text-2xl tracking-tight drop-shadow-lg font-sans">CareerSync</span>
        </div>
        <span className="text-xs text-indigo-200 font-semibold mt-0.5 font-sans">Align Your Ambitions. Discover Your Path.</span>
      </div>
      {/* Right: Navigation and user */}
      <div className="flex items-center gap-6 flex-1 justify-end">
        {/* Hide Dashboard button on survey page */}
        {activePage !== 'survey' && (
          <button onClick={onDashboard} className={`text-white font-semibold text-lg transition-all hidden sm:inline ${activePage === 'dashboard' ? 'underline text-green-300' : 'hover:text-green-300'}`}>Dashboard</button>
        )}
        <button onClick={onProfile} className={`text-white font-semibold text-lg transition-all hidden sm:inline ${activePage === 'profile' ? 'underline text-yellow-300' : 'hover:text-yellow-300'}`}>Profile</button>
        <div className="flex items-center gap-2">
          <span className="bg-white bg-opacity-20 text-white px-3 py-1 rounded-full font-bold text-lg uppercase">{userId?.[0] || 'U'}</span>
          <button onClick={onLogout} className="ml-2 bg-white bg-opacity-20 hover:bg-opacity-40 text-white px-4 py-2 rounded-xl font-semibold shadow transition-all">Logout</button>
        </div>
      </div>
    </nav>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('darkMode') === 'true');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userId, setUserId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState('auth'); // 'auth' | 'survey' | 'dashboard' | 'profile' | 'forum' | 'compare'
  const [sessionTimeout, setSessionTimeout] = useState(false);

  // Extract user from JWT token (for demo, just use username)
  useEffect(() => {
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUserId(payload.sub || '');
      } catch {
        setUserId('');
      }
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      setPage('survey');
      setSessionTimeout(false);
      // Session timeout after 30 min
      const timeout = setTimeout(() => {
        setToken('');
        localStorage.removeItem('token');
        setSessionTimeout(true);
        setPage('auth');
      }, 30 * 60 * 1000);
      return () => clearTimeout(timeout);
    }
  }, [token]);

  const handleSetToken = t => {
    setToken(t);
    localStorage.setItem('token', t);
    setPage('survey');
  };

  const handleSurveyResult = r => {
    setResult(r);
    setPage('dashboard');
  };

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
    setResult(null);
    setPage('auth');
  };

  // Animated transitions (simple fade)
  const fadeClass = 'transition-opacity duration-500';

  return (
    <div className={darkMode ? 'min-h-screen bg-gray-950 text-white' : 'min-h-screen bg-gradient-to-br from-blue-50 to-blue-200 text-black'}>
      {sessionTimeout && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-2 rounded shadow-lg z-50">Session expired. Please log in again.</div>
      )}
      {/* NavBar only on survey/dashboard/profile */}
      {(page === 'survey' || page === 'dashboard' || page === 'profile') && (
        <NavBar
          userId={userId}
          onLogout={handleLogout}
          onProfile={() => setPage('profile')}
          onDashboard={() => result ? setPage('dashboard') : setPage('survey')}
          activePage={page}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}
      <div className="flex flex-col items-center justify-center min-h-[80vh]">
        {page === 'auth' && <div className={fadeClass}><Auth setToken={handleSetToken} /></div>}
        {page === 'survey' && (
          <div className={fadeClass + (loading ? ' opacity-50 pointer-events-none' : '')}>
            <SurveyForm token={token} userId={userId} onResult={r => { setLoading(true); setTimeout(() => { setLoading(false); handleSurveyResult(r); }, 1200); }} />
          </div>
        )}
        {page === 'dashboard' && <div className={fadeClass}><Dashboard result={result} onEdit={() => { setResult(null); setPage('survey'); }} userId={userId} /></div>}
        {page === 'profile' && (userId ? <div className={fadeClass}><Profile userId={userId} onBack={() => setPage('dashboard')} onLogout={handleLogout} /></div> : <div className={fadeClass}><Auth setToken={handleSetToken} /></div>)}
  {/* Forum and Compare pages removed */}
        {loading && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-40">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-600 border-solid"></div>
          </div>
        )}
      </div>
      {/* FeedbackForm can be shown on dashboard page */}
  {/* FeedbackForm removed */}
    {/* Floating Help/Feedback Button on all main pages */}
    {(page === 'survey' || page === 'dashboard' || page === 'profile') && <FloatingHelpButton />}
  </div>
  );
}

export default App;
