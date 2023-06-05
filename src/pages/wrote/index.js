import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const WrotePages = () => {
  const router = useRouter();
  const [wrotes, setWrotes] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/wrote/`);
        const sortedWrote = response.data.sort((a, b) => a.BookID - b.BookID);
        setWrotes(sortedWrote);
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

  const handleEdit = async (bookId, authorId) => {
    try {
      const wrote = wrotes.find((wrote) => wrote.BookID === bookId);
  
      if (!wrote) {
        console.error(`Wrote with BookID ${bookId} not found.`);
        return;
      }

      const updatedAuthorID = prompt('Enter the updated Author ID (Must be number):', wrote.AuthorID);
      const updatedBookID = prompt('Enter the updated Book ID (Must be number):', wrote.BookID);
      
      if (
        !updatedAuthorID &&
        !updatedBookID 
      ) {
        console.log('No fields were updated.');
        return;
      }
  
      const updatedWrote = {
        bookidbefore: bookId,
        authoridbefore: authorId,
        authorid: updatedAuthorID || wrote.AuthorID,
        bookid: updatedBookID || wrote.BookID,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/wrote/`, updatedWrote);

      setWrotes((prevWrotes) =>
        prevWrotes.map((prevWrote) => (prevWrote.BookID === bookId ? updatedWrote : prevWrote))
      );

      alert('Book updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing wrote:', error);
      alert('Error editing wrote');
    }
  };

  const handleDelete = async (bookId, authorId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/wrote/${bookId}/${authorId}`);
      alert('Book deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting book');
    }
  };

  const handleAddWrote = async () => {
    try {

      const newWrote = {
        bookid: prompt('Enter the BookID (Must be a number):'),
        authorid: prompt('Enter the AuthorID (Must be a number):')
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/wrote/`, newWrote);

      setWrotes((prevWrote) => [...prevWrote, newWrote]);

      alert('Wrote added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding wrote');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Wrote</h1>
      {wrotes.length > 0 ? (
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
            {wrotes.map((wrote) => (
              <tr key={wrote.BookID} className="border-b border-gray-300">
                <td className="py-2">{wrote.BookID}</td>
                <td className="py-2">{wrote.AuthorID}</td>
                <td className="py-2">{wrote.Description}</td>
                <td className="py-2">{wrote.FirstName}</td>
                <td className="py-2">{wrote.LastName}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(wrote.BookID, wrote.AuthorID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(wrote.BookID, wrote.AuthorID)}
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
          onClick={handleAddWrote}
        >
          Add Wrote
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8 ml-4"
          onClick={handleGoBack}
        >
          Back to Dashboard
        </button>
    </div>
    </div>
  );
};

export default WrotePages;