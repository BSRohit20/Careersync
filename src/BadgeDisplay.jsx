import React from 'react';

const BADGES = [
  { key: 'first_survey', label: 'First Survey', icon: '🎉', desc: 'Completed your first career survey!' },
  { key: 'five_surveys', label: 'Survey Pro', icon: '🏅', desc: 'Completed 5 career surveys.' },
  { key: 'ten_surveys', label: 'Survey Master', icon: '🥇', desc: 'Completed 10 career surveys.' },
  { key: 'streak_3', label: '3-Day Streak', icon: '🔥', desc: 'Logged in 3 days in a row.' },
  { key: 'streak_7', label: '7-Day Streak', icon: '💯', desc: 'Logged in 7 days in a row.' },
  { key: 'level_5', label: 'Level 5', icon: '🚀', desc: 'Reached Level 5 engagement.' },
  { key: 'first_favorite', label: 'First Favorite', icon: '⭐', desc: 'Saved your first favorite career.' },
  { key: 'profile_pic', label: 'Profile Pic', icon: '🖼️', desc: 'Uploaded a profile picture.' },
];

function getEarnedBadges(userId) {
  let earned = [];
  try {
    const history = JSON.parse(localStorage.getItem('surveyHistory') || '[]');
    const favs = JSON.parse(localStorage.getItem('favorites') || '[]');
    const avatar = localStorage.getItem(`avatar_${userId}`);
    const loginStreak = parseInt(localStorage.getItem(`loginStreak_${userId}`) || '0', 10);
    const level = parseInt(localStorage.getItem(`level_${userId}`) || '1', 10);
    const surveyCount = history.filter(h => h.user_id === userId).length;
    if (surveyCount > 0) earned.push('first_survey');
    if (surveyCount >= 5) earned.push('five_surveys');
    if (surveyCount >= 10) earned.push('ten_surveys');
    if (loginStreak >= 3) earned.push('streak_3');
    if (loginStreak >= 7) earned.push('streak_7');
    if (level >= 5) earned.push('level_5');
    if (favs.filter(f => f.userId === userId).length > 0) earned.push('first_favorite');
    if (avatar) earned.push('profile_pic');
  } catch {}
  return BADGES.filter(b => earned.includes(b.key));
}

function BadgeDisplay({ userId }) {
  const badges = getEarnedBadges(userId);
  if (!userId) return null;
  return (
    <div className="mb-8">
      <h3 className="text-xl font-bold text-purple-700 mb-2">Achievements</h3>
      {badges.length === 0 ? (
        <div className="text-gray-400">No badges earned yet. Complete surveys and explore features!</div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {badges.map(b => (
            <div key={b.key} className="flex flex-col items-center bg-purple-100 border border-purple-300 rounded-xl px-4 py-2 shadow">
              <span className="text-3xl mb-1">{b.icon}</span>
              <span className="font-semibold text-purple-800">{b.label}</span>
              <span className="text-xs text-gray-600 text-center">{b.desc}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BadgeDisplay;
