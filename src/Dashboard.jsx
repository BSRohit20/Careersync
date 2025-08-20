

import React, { useState } from 'react';
import SurveyHistory from './SurveyHistory';
import BadgeDisplay from './BadgeDisplay';
import { useEffect } from 'react';
import CareerDetailModal from './CareerDetailModal';


function Dashboard({ result, onEdit, userId }) {
  const [checked, setChecked] = useState(Array(result?.roadmap?.length || 0).fill(false));
  const [copied, setCopied] = useState(false);
  const [favorites, setFavorites] = useState([]);
  if (!result) return null;

  // Add or remove a favorite career for the user
  const handleFavorite = (careerObj) => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const exists = favs.some(f => f.userId === userId && f.career === careerObj.career);
    let updated;
    if (exists) {
      updated = favs.filter(f => !(f.userId === userId && f.career === careerObj.career));
    } else {
      updated = [...favs, { userId, career: careerObj.career }];
    }
    localStorage.setItem('favorites', JSON.stringify(updated));
    setFavorites(updated.filter(f => f.userId === userId));
  };

  const handleCheck = idx => {
    setChecked(checked => checked.map((c, i) => (i === idx ? !c : c)));
  };

  const handleCopy = () => {
    const text = `Top Careers:\n${result.careers.map(c => `${c.career} (Score: ${c.score})`).join(', ')}\nReasoning: ${result.reasoning}\nRoadmap: ${result.roadmap.join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleDownload = () => {
    const text = `Top Careers:\n${result.careers.map(c => `${c.career} (Score: ${c.score})`).join(', ')}\nReasoning: ${result.reasoning}\nRoadmap: ${result.roadmap.join(', ')}`;
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'career_suggestions.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  // User avatar (first letter of userId)
  const avatar = userId ? userId[0].toUpperCase() : 'U';
  const [showDetail, setShowDetail] = useState(null);
  const [surveyCount, setSurveyCount] = useState(0);
  useEffect(() => {
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    setFavorites(favs.filter(f => f.userId === userId));
    const history = JSON.parse(localStorage.getItem('surveyHistory') || '[]');
    setSurveyCount(history.filter(h => h.user_id === userId).length);
  }, [userId]);

  return (
  <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-16 mt-20">
      <div className="flex items-center mb-6">
        <div className="w-14 h-14 rounded-full bg-blue-600 flex items-center justify-center text-white text-2xl font-bold mr-4">{avatar}</div>
        <div>
          <div className="text-lg font-semibold">Welcome, {userId || 'User'}!</div>
          <div className="text-gray-500 text-sm">Here are your personalized career suggestions.</div>
        </div>
      </div>
      {/* Personalized Stats/Tips */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between bg-gradient-to-r from-blue-50 to-pink-50 rounded-xl p-6 shadow-inner">
        <div className="text-lg font-semibold text-blue-700">Surveys Taken: <span className="text-blue-900">{surveyCount}</span></div>
        <div className="text-lg font-semibold text-yellow-600">Favorites: <span className="text-yellow-800">{favorites.length}</span></div>
        <div className="text-md italic text-purple-700 mt-2 md:mt-0">Tip: Explore details by clicking a career!</div>
      </div>
  <BadgeDisplay userId={userId} />
  <h2 className="text-3xl font-bold text-blue-700 mb-4 text-center">Your Career Suggestions</h2>
      <div className="grid gap-4 mb-6">
        {result.careers.map((c, i) => {
          const isFav = favorites.some(f => f.career === c.career && f.userId === userId);
          return (
            <div key={i} className={`border p-4 rounded-lg flex items-center justify-between shadow-sm ${i === 0 ? 'bg-blue-50 border-blue-400' : 'bg-gray-50'}`}>
              <div className="cursor-pointer" onClick={() => setShowDetail(c)}>
                <span className="font-semibold text-lg underline hover:text-blue-700">{c.career}</span>
                {i === 0 && <span className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">Top Match</span>}
                <span className="ml-2 text-gray-500 text-sm">Score: {c.match_score ?? c.score}</span>
              </div>
              <button
                onClick={() => handleFavorite(c)}
                className={`ml-4 px-2 py-1 ${isFav ? 'bg-yellow-500 text-white' : 'bg-yellow-400 text-yellow-900'} hover:bg-yellow-500 text-xs rounded font-bold transition`}
                title={isFav ? 'Remove from Favorites' : 'Save to Favorites'}
              >
                {isFav ? '★ Saved' : '★ Save'}
              </button>
            </div>
          );
        })}
      </div>
      {showDetail && <CareerDetailModal career={showDetail} onClose={() => setShowDetail(null)} />}
      {/* Favorites Section */}
      <div className="mb-8">
        <h3 className="text-xl font-bold text-yellow-600 mb-2">Your Favorites</h3>
        {favorites.length === 0 ? (
          <div className="text-gray-400">No favorites yet. Click ★ Save to add.</div>
        ) : (
          <ul className="flex flex-wrap gap-3">
            {favorites.map((f, i) => (
              <li key={i} className="bg-yellow-100 border border-yellow-300 rounded px-3 py-1 text-yellow-800 font-semibold text-sm">{f.career}</li>
            ))}
          </ul>
        )}
      </div>
      <div className="mb-4">
        <strong>Reasoning:</strong>
        <div className="bg-gray-100 rounded p-3 mt-1 text-gray-700">{result.reasoning}</div>
      </div>
      <div className="mb-6">
        <strong>Roadmap:</strong>
        <ul className="list-none mt-2">
          {result.roadmap.map((step, i) => (
            <li key={i} className="flex items-center mb-2">
              <input type="checkbox" checked={checked[i]} onChange={() => handleCheck(i)} className="mr-2" />
              <span className={checked[i] ? 'line-through text-gray-400' : ''}>{step}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex gap-4 mb-6 justify-center">
        <button onClick={handleDownload} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded font-semibold">Download</button>
        <button onClick={handleCopy} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">{copied ? 'Copied!' : 'Share'}</button>
        <button onClick={onEdit} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded font-semibold">Edit Survey</button>
      </div>

      <div className="mt-12">
        <SurveyHistory userId={userId} />
      </div>
    </div>
  );
}

export default Dashboard;
