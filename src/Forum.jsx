import React, { useState, useEffect } from 'react';

// Simple localStorage-based forum for demo
function Forum() {
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState('');
  const [user, setUser] = useState('');

  useEffect(() => {
    setPosts(JSON.parse(localStorage.getItem('forumPosts') || '[]'));
    setUser(localStorage.getItem('profile') ? JSON.parse(localStorage.getItem('profile')).username : 'Anonymous');
  }, []);

  const handlePost = () => {
    if (!text.trim()) return;
    const newPost = { user, text, date: new Date().toLocaleString() };
    const updated = [newPost, ...posts];
    setPosts(updated);
    localStorage.setItem('forumPosts', JSON.stringify(updated));
    setText('');
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-3xl p-10 mt-20 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-center mb-6 tracking-tight drop-shadow-lg">Community Forum</h2>
      <div className="mb-6">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Share your question or experience..." className="w-full border rounded p-2 mb-2" rows={3} />
        <button onClick={handlePost} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded font-semibold">Post</button>
      </div>
      <div>
        {posts.length === 0 ? <div className="text-gray-400">No posts yet. Be the first to share!</div> : (
          <ul className="space-y-4">
            {posts.map((p, i) => (
              <li key={i} className="border rounded p-4 bg-gray-50">
                <div className="font-semibold text-blue-700">{p.user} <span className="text-xs text-gray-400">{p.date}</span></div>
                <div className="mt-1 text-gray-700">{p.text}</div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default Forum;
