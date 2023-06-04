import React from 'react';

const HomePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md px-8 py-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">PostgreSQL Interface</h1>
        <p className="text-gray-600 mb-6 text-center">Aufa Nasywa Rahman <br /> 21/475255/TK/52454</p>
        <div className="flex justify-center">
          <a href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center">
            Continue
          </a>
        </div>
      </div>
    </div>
  );
};

export default HomePage;