import React, { useState } from 'react';

const CAREER_DATA = [
  {
    title: 'Software Engineer',
    skills: 'Programming, Problem-solving, Teamwork',
    salary: '$80,000 - $150,000',
    outlook: 'High demand, strong growth',
    education: 'Bachelor’s in CS or related',
  },
  {
    title: 'Data Scientist',
    skills: 'Statistics, Machine Learning, Python',
    salary: '$90,000 - $160,000',
    outlook: 'Very high demand',
    education: 'Bachelor’s/Master’s in Data Science',
  },
  // Add more as needed
];

function CareerCompare() {
  const [selected, setSelected] = useState([]);

  const handleSelect = (title) => {
    setSelected((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  const careers = CAREER_DATA.filter((c) => selected.includes(c.title));

  return (
    <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-3xl p-10 mt-20 animate-fade-in">
      <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-purple-700 to-pink-600 text-center mb-6 tracking-tight drop-shadow-lg">Career Comparison</h2>
      <div className="mb-6 flex flex-wrap gap-3">
        {CAREER_DATA.map((c) => (
          <button
            key={c.title}
            onClick={() => handleSelect(c.title)}
            className={`px-4 py-2 rounded ${selected.includes(c.title) ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
          >
            {c.title}
          </button>
        ))}
      </div>
      {careers.length > 0 && (
        <table className="w-full border mt-6">
          <thead>
            <tr className="bg-blue-100">
              <th className="p-2">Career</th>
              <th className="p-2">Skills</th>
              <th className="p-2">Salary</th>
              <th className="p-2">Outlook</th>
              <th className="p-2">Education</th>
            </tr>
          </thead>
          <tbody>
            {careers.map((c) => (
              <tr key={c.title} className="text-center">
                <td className="p-2 font-bold">{c.title}</td>
                <td className="p-2">{c.skills}</td>
                <td className="p-2">{c.salary}</td>
                <td className="p-2">{c.outlook}</td>
                <td className="p-2">{c.education}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CareerCompare;
