import React, { useEffect, useState } from 'react';

function SurveyHistory({ userId }) {
  const [history, setHistory] = useState([]);
  useEffect(() => {
    // For demo: load from localStorage
    try {
      const h = JSON.parse(localStorage.getItem('surveyHistory') || '[]');
      if (Array.isArray(h)) {
        setHistory(h.filter(x => x.user_id === userId));
      } else {
        setHistory([]);
      }
    } catch (e) {
      console.error('Error loading survey history:', e);
      setHistory([]);
    }
  }, [userId]);
  if (!userId) return null;
  return (
    <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-10 mt-12 animate-fade-in">
      <h2 className="text-2xl font-bold text-blue-700 mb-4 text-center">Survey History</h2>
      {history.length === 0 ? (
        <div className="text-gray-500 text-center">No survey history found.</div>
      ) : (
        <ul className="space-y-4">
          {history.map((h, i) => (
            <li key={i} className="border rounded p-4 bg-gray-50">
              <div className="font-semibold">Date: {h.date || 'Unknown'}</div>
              <div><span className="font-semibold">Skills:</span> {h.skills.join(', ')}</div>
              <div><span className="font-semibold">Education:</span> {h.education}</div>
              <div><span className="font-semibold">Interests:</span> {h.interests.join(', ')}</div>
              <div><span className="font-semibold">Personality:</span> {h.personality}</div>
              <div><span className="font-semibold">Goals:</span> {h.goals}</div>
              <div><span className="font-semibold">Top Career:</span> {h.careers?.[0]?.career || '-'}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SurveyHistory;
