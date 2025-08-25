
import React, { useState, useRef } from 'react';
import SurveyHistory from './SurveyHistory';
import BadgeDisplay from './BadgeDisplay';
// import { useNavigate } from 'react-router-dom';

function Profile({ userId, onBack, onLogout }) {
  if (!userId) {
    return (
      <div className="max-w-xl mx-auto bg-white shadow-2xl rounded-3xl p-12 mt-32 text-center animate-fade-in">
        <div className="text-2xl font-bold text-red-600 mb-4">You are not logged in.</div>
        <button onClick={onLogout} className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded shadow">Go to Login</button>
      </div>
    );
  }
  let initialProfile = { username: userId, fullName: '', email: '', age: '', phone: '' };
  try {
    const stored = JSON.parse(localStorage.getItem('profile'));
    if (stored && typeof stored === 'object' && stored.username === userId) initialProfile = stored;
  } catch (e) {
    console.error('Error loading profile from localStorage:', e);
  }
  const [profile, setProfile] = useState(initialProfile);
  const [avatar, setAvatar] = useState(() => localStorage.getItem(`avatar_${userId}`) || '');
  const fileInputRef = useRef();
  const [edit, setEdit] = useState(false);
  const [msg, setMsg] = useState('');

  const handleChange = e => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };
  const handleSave = () => {
    localStorage.setItem('profile', JSON.stringify(profile));
    setEdit(false);
    setMsg('Profile updated!');
    setTimeout(() => setMsg(''), 2000);
  };

  const handleAvatarChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = ev => {
        setAvatar(ev.target.result);
        localStorage.setItem(`avatar_${userId}`, ev.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-16 mt-20 animate-fade-in">
  <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-center mb-6 tracking-tight drop-shadow-lg">Profile</h2>
  <BadgeDisplay userId={userId} />
  <div className="flex flex-col items-center">
        <div className="w-24 h-24 rounded-full bg-blue-600 flex items-center justify-center text-white text-4xl font-bold mb-4 overflow-hidden relative group cursor-pointer" onClick={() => fileInputRef.current.click()} title="Click to upload/change profile picture">
          {avatar ? (
            <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            userId ? userId[0].toUpperCase() : 'U'
          )}
          <input type="file" accept="image/*" ref={fileInputRef} onChange={handleAvatarChange} className="hidden" />
          <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs bg-black bg-opacity-60 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition">Change</span>
        </div>
        <div className="text-lg font-semibold mb-2">Username: <span className="text-blue-700">{userId || 'User'}</span></div>
        <div className="w-full max-w-md">
          <div className="mb-2">
            <label className="font-semibold">Full Name:</label>
            {edit ? <input name="fullName" value={profile.fullName} onChange={handleChange} className="w-full border rounded px-2 py-1" /> : <span className="ml-2">{profile.fullName || '-'}</span>}
          </div>
          <div className="mb-2">
            <label className="font-semibold">Email:</label>
            {edit ? <input name="email" value={profile.email} onChange={handleChange} className="w-full border rounded px-2 py-1" /> : <span className="ml-2">{profile.email || '-'}</span>}
          </div>
          <div className="mb-2">
            <label className="font-semibold">Age:</label>
            {edit ? <input name="age" value={profile.age} onChange={handleChange} className="w-full border rounded px-2 py-1" /> : <span className="ml-2">{profile.age || '-'}</span>}
          </div>
          <div className="mb-2">
            <label className="font-semibold">Phone:</label>
            {edit ? <input name="phone" value={profile.phone} onChange={handleChange} className="w-full border rounded px-2 py-1" /> : <span className="ml-2">{profile.phone || '-'}</span>}
          </div>
          <div className="flex gap-4 mt-4">
            {edit ? (
              <>
                <button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Save</button>
                <button onClick={() => setEdit(false)} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Cancel</button>
              </>
            ) : (
              <button onClick={() => setEdit(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded">Edit Profile</button>
            )}
          </div>
          {msg && <div className="text-green-600 mt-2">{msg}</div>}
        </div>
      </div>

      <div className="mt-12">
        <SurveyHistory userId={userId} />
      </div>
    </div>
  );
}

export default Profile;
