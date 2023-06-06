import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const BookGenrePage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedBookGenreIds, setSelectedBookGenreIds] = useState([]);

  useEffect(() => {
    const fetchBookGenres = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/BookGenre/`);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching book genres:', error);
        alert('Error fetching book genres');
      }
    };

    fetchBookGenres();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (bookGenreId, genreId) => {
    try {
      const editedBookGenre = data.find((bookGenre) => bookGenre.BookID === bookGenreId);

      if (!editedBookGenre) {
        console.error(`BookGenre with ID ${bookGenreId} not found.`);
        return;
      }

      const updatedBookID = prompt('Enter the updated Book ID:', editedBookGenre.BookID);
      const updatedGenreID = prompt('Enter the updated Genre ID:', editedBookGenre.GenreID);

      if (!updatedGenreID) {
        console.log('No fields were updated.');
        return;
      }

      const updatedBookGenre = {
        bookidbefore: bookGenreId,
        genreidbefore: genreId,
        bookid: updatedBookID,
        genreid: updatedGenreID,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/BookGenre/`, updatedBookGenre);

      setData((prevData) =>
        prevData.map((bookGenre) => (bookGenre.BookID === bookGenreId ? updatedBookGenre : bookGenre))
      );

      alert('BookGenre updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing book genre:', error);
      alert('Error editing book genre');
    }
  };

  const handleDelete = async (bookGenreId, genreId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/BookGenre/${bookGenreId}/${genreId}`);
      alert('BookGenre deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting book genre! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const newGenreID = prompt('Enter the Genre ID:');
      const newBookID = prompt('Enter the Book ID:');

      if (!newGenreID) {
        console.log('No Genre ID provided.');
        return;
      }

      const newBookGenre = {
        BookID: newBookID,
        GenreID: newGenreID,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/BookGenre/`, newBookGenre);

      setData((prevData) => [...prevData, newBookGenre]);

      alert('BookGenre added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding book genre');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">BookGenre</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Book ID</th>
              <th className="font-bold text-left py-2">Genre ID</th>
                <th className="font-bold text-left py-2">Book Title</th>
                <th className="font-bold text-left py-2">Genre Name</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((bookGenre) => (
              <tr key={bookGenre.BookID} className="border-b border-gray-300">
                <td className="py-2">{bookGenre.BookID}</td>
                <td className="py-2">{bookGenre.GenreID}</td>
                <td className="py-2">{bookGenre.BookTitle}</td>
                <td className="py-2">{bookGenre.GenreName}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(bookGenre.BookID, bookGenre.GenreID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(bookGenre.BookID, bookGenre.GenreID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No book genres available</p>
      )}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8"
          onClick={handleAdd}
        >
          Add BookGenre
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

export default BookGenrePage;
