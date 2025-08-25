
import React, { useState } from 'react';
import { predictCareer } from './api';

const educationOptions = [
  '',
  'High School',
  'Associate Degree',
  "Bachelor's Degree",
  "Master's Degree",
  'PhD',
  'Other',
];

function SurveyForm({ token, userId, onResult }) {
  const [form, setForm] = useState({ skills: '', education: '', interests: '', personality: '', goals: '' });
  const [error, setError] = useState('');
  const [touched, setTouched] = useState({});

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setTouched({ ...touched, [e.target.name]: true });
  };

  const validate = () => {
    if (!form.skills.trim()) return 'Please enter at least one skill.';
    if (!form.education) return 'Please select your education.';
    if (!form.interests.trim()) return 'Please enter at least one interest.';
    if (!form.personality.trim()) return 'Please describe your personality.';
    if (!form.goals.trim()) return 'Please enter your goals.';
    return '';
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }
    try {
      const payload = {
        user_id: userId,
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        education: form.education,
        interests: form.interests.split(',').map(s => s.trim()).filter(Boolean),
        personality: form.personality,
        goals: form.goals
      };
      const res = await predictCareer(payload, token);
      onResult(res.data);
      // Save to survey history in localStorage
      const history = JSON.parse(localStorage.getItem('surveyHistory') || '[]');
      history.push({
        user_id: userId,
        date: new Date().toLocaleString(),
        skills: payload.skills,
        education: payload.education,
        interests: payload.interests,
        personality: payload.personality,
        goals: payload.goals,
        careers: res.data.careers
      });
      localStorage.setItem('surveyHistory', JSON.stringify(history));
    } catch (err) {
      const detail = err.response?.data?.detail;
      if (typeof detail === 'string') {
        setError(detail);
      } else if (Array.isArray(detail)) {
        setError(detail.map(e => e.msg).join(' '));
      } else {
        setError('Error');
      }
    }
  };

  // Progress stepper logic
  const steps = [
    'Skills',
    'Education',
    'Interests',
    'Personality',
    'Goals',
  ];
  const currentStep = steps.findIndex((step, idx) => {
    if (idx === 0) return !form.skills.trim();
    if (idx === 1) return !form.education;
    if (idx === 2) return !form.interests.trim();
    if (idx === 3) return !form.personality.trim();
    if (idx === 4) return !form.goals.trim();
    return false;
  });

  return (
  <form onSubmit={handleSubmit} className="w-full max-w-7xl mx-auto bg-white shadow-2xl rounded-3xl p-8 md:p-16 lg:p-32 xl:p-40 mt-20 space-y-6 relative overflow-hidden animate-fade-in">
      {/* Progress Bar */}
      <div className="w-full h-3 bg-gray-200 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 transition-all duration-500" style={{width: `${((currentStep+1)/steps.length)*100}%`}}></div>
      </div>
      {/* Animated gradient header */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-gradient-to-br from-blue-400 via-purple-400 to-pink-400 opacity-30 rounded-full filter blur-3xl animate-pulse" style={{animationDuration:'7s'}}></div>
      <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-gradient-to-tr from-green-400 via-blue-400 to-purple-400 opacity-30 rounded-full filter blur-3xl animate-pulse" style={{animationDuration:'9s'}}></div>
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-center mb-6 tracking-tight drop-shadow-lg">Career Survey</h2>
      {/* Progress Stepper */}
      <div className="flex justify-between items-center mb-8 gap-4 md:gap-8 lg:gap-12">
        {steps.map((step, idx) => (
          <div key={step} className="flex flex-col items-center min-w-[70px]">
            <div className={`w-10 h-10 flex items-center justify-center rounded-full border-4 text-lg font-bold shadow-md transition-all duration-300 ${idx <= currentStep ? 'border-blue-600 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 text-white scale-110' : 'border-gray-300 bg-gray-100 text-gray-400'}`}>{idx + 1}</div>
            <div className={`text-sm mt-2 ${idx <= currentStep ? 'text-blue-700 font-semibold' : 'text-gray-400'}`}>{step}</div>
          </div>
        ))}
      </div>
      {/* Survey Fields */}
      <div>
        <label className="block font-semibold mb-1 text-gray-700">Skills <span className="text-gray-400 text-xs">(comma separated)</span></label>
        <input name="skills" value={form.skills} onChange={handleChange} placeholder="e.g. Python, Communication" className="w-full border-2 border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
        <div className="text-xs text-gray-500 mt-1">List your main skills, separated by commas.</div>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-700">Education</label>
        <select name="education" value={form.education} onChange={handleChange} className="w-full border-2 border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all">
          {educationOptions.map(opt => <option key={opt} value={opt}>{opt || 'Select education'}</option>)}
        </select>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-700">Interests <span className="text-gray-400 text-xs">(comma separated)</span></label>
        <input name="interests" value={form.interests} onChange={handleChange} placeholder="e.g. AI, Design" className="w-full border-2 border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
        <div className="text-xs text-gray-500 mt-1">What are you interested in? Separate with commas.</div>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-700">Personality</label>
        <input name="personality" value={form.personality} onChange={handleChange} placeholder="e.g. Analytical, Creative" className="w-full border-2 border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
        <div className="text-xs text-gray-500 mt-1">Describe your personality traits.</div>
      </div>
      <div>
        <label className="block font-semibold mb-1 text-gray-700">Goals</label>
        <input name="goals" value={form.goals} onChange={handleChange} placeholder="e.g. Become a Data Scientist" className="w-full border-2 border-blue-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all" />
        <div className="text-xs text-gray-500 mt-1">What are your career goals?</div>
      </div>
  {error && <div className="text-red-600 text-center font-semibold mt-2 animate-shake">{error}</div>}
  <button type="submit" className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 hover:from-blue-700 hover:to-pink-600 text-white font-bold py-2 rounded-xl shadow-lg transition-all duration-200 text-lg tracking-wide mt-2">Get Career Suggestions</button>
      <style>{`
        .animate-fade-in { animation: fadeIn 0.8s; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(30px);} to { opacity: 1; transform: none; } }
        .animate-shake { animation: shake 0.4s; }
        @keyframes shake { 10%, 90% { transform: translateX(-2px); } 20%, 80% { transform: translateX(4px); } 30%, 50%, 70% { transform: translateX(-8px); } 40%, 60% { transform: translateX(8px); } }
      `}</style>
    </form>
  );
}

export default SurveyForm;
