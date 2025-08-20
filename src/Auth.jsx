import React, { useState } from 'react';
import { signup, login } from './api';

const inputStyle = {
  width: '100%',
  border: '1.5px solid #a5b4fc',
  borderRadius: 8,
  padding: '8px 12px',
  marginTop: 4,
  marginBottom: 2,
  fontSize: 15,
  outline: 'none',
  transition: 'border 0.2s',
  boxSizing: 'border-box',
};


function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function Auth({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  // Captcha state
  const [captcha, setCaptcha] = useState(() => {
    const a = getRandomInt(1, 10);
    const b = getRandomInt(1, 10);
    return { a, b, answer: a + b };
  });
  const [captchaInput, setCaptchaInput] = useState('');

  const saveProfile = (profile) => {
    localStorage.setItem('profile', JSON.stringify(profile));
  };

  const regenerateCaptcha = () => {
    const a = getRandomInt(1, 10);
    const b = getRandomInt(1, 10);
    setCaptcha({ a, b, answer: a + b });
    setCaptchaInput('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (isLogin) {
      if (parseInt(captchaInput, 10) !== captcha.answer) {
        setError('Captcha incorrect. Please try again.');
        regenerateCaptcha();
        return;
      }
    }
    setLoading(true);
    try {
      if (isLogin) {
        const res = await login({ username, password });
        setToken(res.data.access_token);
      } else {
        await signup({ username, password });
        saveProfile({ username, fullName, email, age, phone });
        setIsLogin(true);
      }
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map(e => e.msg).join(' '));
      } else {
        setError('Error');
      }
    } finally {
      setLoading(false);
      if (isLogin) regenerateCaptcha();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      minWidth: '100vw',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(120deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
      backgroundAttachment: 'fixed',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover',
      overflow: 'hidden',
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: 1000,
    }}>
      <div style={{
        background: 'rgba(255,255,255,0.92)',
        boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.18)',
        borderRadius: '2rem',
        padding: '2.5rem 2.5rem 2rem 2.5rem',
        maxWidth: 400,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
      }}>
        <div style={{
          background: 'linear-gradient(135deg, #60a5fa, #a78bfa, #f472b6)',
          borderRadius: '50%',
          width: 64,
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: 18,
          boxShadow: '0 4px 16px 0 rgba(100, 100, 255, 0.18)',
        }}>
          <svg width="34" height="34" fill="none" stroke="white" strokeWidth="2.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2.5" fill="none"/>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5m0 4h.01" />
          </svg>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <img src="/logo.svg" alt="CareerSync Logo" style={{ width: 38, height: 38, borderRadius: '50%', boxShadow: '0 2px 8px #a78bfa55' }} />
          <h1 style={{
            fontSize: '2.1rem',
            fontWeight: 800,
            background: 'linear-gradient(90deg, #2563eb, #a21caf, #db2777)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px',
            margin: 0,
            fontFamily: 'Inter, Poppins, Lato, sans-serif'
          }}>CareerSync</h1>
        </div>
        <div style={{ fontSize: 15, color: '#6366f1', fontWeight: 600, marginBottom: 10, textAlign: 'center', fontFamily: 'Inter, Poppins, Lato, sans-serif' }}>
          Align Your Ambitions. Discover Your Path.
        </div>
        <p style={{ color: '#555', fontSize: 15, marginBottom: 18, textAlign: 'center' }}>{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>
        <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {!isLogin && <>
            <label style={{ fontWeight: 600, color: '#333', fontSize: 14 }}>Full Name
              <input value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Enter your full name" style={inputStyle} />
            </label>
            <label style={{ fontWeight: 600, color: '#333', fontSize: 14 }}>Email
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Enter your email" style={inputStyle} />
            </label>
            <label style={{ fontWeight: 600, color: '#333', fontSize: 14 }}>Age
              <input type="number" value={age} onChange={e => setAge(e.target.value)} placeholder="Enter your age" style={inputStyle} />
            </label>
            <label style={{ fontWeight: 600, color: '#333', fontSize: 14 }}>Phone
              <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="Enter your phone number" style={inputStyle} />
            </label>
          </>}
          <label style={{ fontWeight: 600, color: '#333', fontSize: 14 }}>Username
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="Enter username" style={inputStyle} />
          </label>
          <label style={{ fontWeight: 600, color: '#333', fontSize: 14 }}>Password
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" style={inputStyle} autoComplete="current-password" />
          </label>
          {/* Captcha for login only */}
          {isLogin && (
            <label style={{ fontWeight: 600, color: '#333', fontSize: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
              Captcha: What is {captcha.a} + {captcha.b}?
              <input
                type="number"
                value={captchaInput}
                onChange={e => setCaptchaInput(e.target.value)}
                placeholder="Enter answer"
                style={{ ...inputStyle, width: 100, marginBottom: 0, marginTop: 0 }}
                required
              />
              <button type="button" onClick={regenerateCaptcha} style={{ marginLeft: 8, background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontWeight: 700, fontSize: 18 }} title="Refresh Captcha">↻</button>
            </label>
          )}
          {error && <div style={{ color: '#e11d48', fontWeight: 600, fontSize: 14, textAlign: 'center', marginTop: 2 }}>{error}</div>}
          <button type="submit" disabled={loading} style={{
            width: '100%',
            background: 'linear-gradient(90deg, #2563eb, #a21caf, #db2777)',
            color: 'white',
            fontWeight: 700,
            fontSize: 17,
            border: 'none',
            borderRadius: 10,
            padding: '10px 0',
            marginTop: 6,
            boxShadow: '0 2px 8px 0 rgba(31, 38, 135, 0.10)',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1,
            transition: 'all 0.2s',
          }}>{loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Login' : 'Sign Up')}</button>
        </form>
        <button type="button" onClick={() => setIsLogin(!isLogin)} style={{
          marginTop: 18,
          color: '#a21caf',
          fontWeight: 600,
          fontSize: 15,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}>
          {isLogin ? 'Need an account? Sign up' : 'Have an account? Login'}
        </button>
      </div>
    </div>
  );
}

export default Auth;
