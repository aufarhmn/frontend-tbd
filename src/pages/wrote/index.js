import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const WrotePages = () => {
  const router = useRouter();
  const [wrote, setWrote] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wrote/`);
        const sortedWrote = response.data.sort((a, b) => a.BookID - b.BookID);
        setWrote(sortedWrote);
        console.log(sortedWrote);
      } catch (error) {
        console.error('Error fetching books:', error);
        alert('Error fetching books');
      }
    };
  
    fetchInfo();
  }, []);  

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = (authorsId) => {
    // Handle edit logic here
    console.log(`Editing book with ID: ${authorsId}`);
  };

  const handleDelete = (authorsId) => {
    // Handle delete logic here
    console.log(`Deleting book with ID: ${authorsId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Wrote</h1>
      {wrote.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Book ID</th>
              <th className="font-bold text-left py-2">Author ID</th>
              <th className="font-bold text-left py-2">Description</th>
              <th className="font-bold text-left py-2">Author First Name</th>
              <th className="font-bold text-left py-2">Author Last Name</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {wrote.map((wrote) => (
              <tr key={wrote.BookID} className="border-b border-gray-300">
                <td className="py-2">{wrote.BookID}</td>
                <td className="py-2">{wrote.AuthorID}</td>
                <td className="py-2">{wrote.Description}</td>
                <td className="py-2">{wrote.FirstName}</td>
                <td className="py-2">{wrote.LastName}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(wrote.BookID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(wrote.BookID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No data available</p>
      )}
    <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8"
          onClick={handleGoBack}
        >
          Back to Dashboard
        </button>
    </div>
    </div>
  );
};

export default WrotePages;