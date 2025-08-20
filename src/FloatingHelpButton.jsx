import React, { useState } from 'react';

function FloatingHelpButton() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! I am your CareerPredict Assistant. How can I help you with this project?' }
  ]);
  const [input, setInput] = useState('');

  // Simple project-specific bot logic
  function getBotReply(userMsg) {
    const msg = userMsg.toLowerCase();
    if (msg.includes('survey')) return 'You can fill out the career survey to get personalized career recommendations.';
    if (msg.includes('profile')) return 'On the Profile page, you can edit your details and upload a profile picture.';
    if (msg.includes('badge') || msg.includes('achievement')) return 'You earn badges for completing surveys, saving favorites, and uploading a profile picture!';
    if (msg.includes('favorite')) return 'You can save favorite careers from your dashboard for quick access later.';
    if (msg.includes('dark')) return 'Use the sun/moon icon in the top bar to toggle dark mode.';
    if (msg.includes('dashboard')) return 'The dashboard shows your career recommendations and achievements.';
    if (msg.includes('help') || msg.includes('feedback')) return 'Just type your question about the app, and I will do my best to help!';
    if (msg.includes('reset')) return 'To reset your progress, clear your browser localStorage.';
    return 'Sorry, I am a simple project assistant. Please ask about surveys, profile, badges, favorites, or dashboard.';
  }

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(msgs => [...msgs, { from: 'user', text: input }]);
    setTimeout(() => {
      setMessages(msgs => [...msgs, { from: 'bot', text: getBotReply(input) }]);
    }, 600);
    setInput('');
  };

  return (
    <>
      <button
        className="fixed bottom-8 right-8 z-50 bg-gradient-to-br from-blue-600 to-pink-500 text-white rounded-full shadow-lg w-16 h-16 flex items-center justify-center text-3xl hover:scale-110 transition"
        onClick={() => setOpen(true)}
        title="Help & Feedback"
      >
        💬
      </button>
      {open && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full relative animate-fade-in flex flex-col" style={{height:'420px'}}>
            <button onClick={() => setOpen(false)} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl">&times;</button>
            <h2 className="text-xl font-bold text-blue-700 mb-2">CareerPredict Chat Assistant</h2>
            <div className="flex-1 overflow-y-auto bg-gray-50 rounded p-2 mb-2 border">
              {messages.map((m, i) => (
                <div key={i} className={`mb-2 flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`px-3 py-2 rounded-lg max-w-xs ${m.from === 'user' ? 'bg-blue-200 text-right' : 'bg-purple-100 text-left'} text-sm`}>{m.text}</div>
                </div>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <input
                className="flex-1 border rounded px-2 py-1"
                placeholder="Type your question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
                autoFocus
              />
              <button onClick={handleSend} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded">Send</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FloatingHelpButton;
