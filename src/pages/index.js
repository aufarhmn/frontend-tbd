import Link from 'next/link';
import React, { useState } from 'react';

const HomePage = () => {
  const [password, setPassword] = useState('');
  const [showDashboard, setShowDashboard] = useState(false);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.NEXT_PUBLIC_PASSWORD) {
      setShowDashboard(true);
    } else {
      alert("Incorrect password. Password is the same as Aufa's VM Password");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex items-center justify-center">
      <div className="max-w-md px-8 py-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-2xl font-bold mb-4 text-center">Good Reading Bookstore Interface</h1>
        <p className="text-gray-600 mb-6 text-center">
          Aufa Nasywa Rahman <br />
          21/475255/TK/52454
        </p>
        {!showDashboard ? (
          <form onSubmit={handlePasswordSubmit}>
            <div className="flex justify-center mb-4">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border border-gray-300 rounded px-4 py-2"
              />
            </div>
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center"
              >
                Proceed to Dashboard
              </button>
            </div>
          </form>
        ) : (
          <div className="flex justify-center">
            <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded items-center">
              Continue to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;