import React, { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const SqlCommandRawPage = () => {
  const router = useRouter();
  const [input, setInput] = useState('');
  const [output, setOutput] = useState(null);

  const handleInputChange = (event) => {
    setInput(event.target.value);
  };

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleExecuteQuery = async () => {
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sqlbuilders/raw`, {
        sql: input
      });
      setOutput(response.data);
    } catch (error) {
      console.error('Error executing query:', error);
      alert(error.response.data.error);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Execute SQL Command</h1>
      <div className="flex mb-4">
        <textarea
          value={input}
          onChange={handleInputChange}
          className="border border-gray-300 px-4 py-2 rounded-lg flex-1 mr-4 resize-none"
          placeholder="Enter SQL command"
          rows={5}
        />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleExecuteQuery}
        >
          Execute
        </button>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-bold mb-4">Output:</h2>
        {output ? (
          <pre>{JSON.stringify(output, null, 2)}</pre>
        ) : (
          <p>No output available</p>
        )}
      </div>
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-8"
          onClick={handleGoBack}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default SqlCommandRawPage;