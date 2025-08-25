import React from 'react';

function CareerDetailModal({ career, onClose }) {
  if (!career) return null;
  // Example details; in a real app, fetch more info from backend or a DB
  const details = {
    'Software Engineer': {
      skills: 'Programming, Problem-solving, Teamwork',
      salary: '$80,000 - $150,000',
      outlook: 'High demand, strong growth',
      description: 'Designs, develops, and maintains software applications.'
    },
    'Data Scientist': {
      skills: 'Statistics, Machine Learning, Python',
      salary: '$90,000 - $160,000',
      outlook: 'Very high demand',
      description: 'Analyzes and interprets complex data to help organizations make decisions.'
    },
    // ...add more as needed
  };
  const info = details[career.career] || { skills: career.skills || '-', salary: '-', outlook: '-', description: career.description || '-' };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-lg w-full relative animate-fade-in">
        <button onClick={onClose} className="absolute top-3 right-3 text-gray-500 hover:text-red-500 text-2xl">&times;</button>
        <h2 className="text-2xl font-bold text-blue-700 mb-2">{career.career}</h2>
        <div className="mb-2 text-gray-700">{info.description}</div>
        <div className="mb-1"><span className="font-semibold">Key Skills:</span> {info.skills}</div>
        <div className="mb-1"><span className="font-semibold">Salary Range:</span> {info.salary}</div>
        <div className="mb-1"><span className="font-semibold">Job Outlook:</span> {info.outlook}</div>
      </div>
    </div>
  );
}

export default CareerDetailModal;
