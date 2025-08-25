import React, { useState } from 'react';
import { sendFeedback } from './api';

function FeedbackForm({ token, userId }) {
  const [suggestion, setSuggestion] = useState('');
  const [msg, setMsg] = useState('');
  const handleSubmit = async e => {
    e.preventDefault();
    setMsg('');
    await sendFeedback({ user_id: userId, feedback: suggestion }, token);
    setMsg('Thank you for your suggestion!');
    setSuggestion('');
  };
  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-4 space-y-2">
      <textarea value={suggestion} onChange={e => setSuggestion(e.target.value)} placeholder="Your suggestion..." className="w-full border p-2" />
      <button type="submit" className="btn bg-purple-600 text-white w-full py-2 rounded">Send Suggestion</button>
      {msg && <div className="text-green-600">{msg}</div>}
    </form>
  );
}
export default FeedbackForm;
