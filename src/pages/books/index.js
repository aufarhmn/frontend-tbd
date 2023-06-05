import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const BooksPage = () => {
  const router = useRouter();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/books/`);
        const sortedBooks = response.data.sort((a, b) => a.BookID - b.BookID);
        setBooks(sortedBooks);
        console.log(sortedBooks);
      } catch (error) {
        console.error('Error fetching books:', error);
        alert('Error fetching books');
      }
    };
  
    fetchBooks();
  }, []);  

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEditBook = (bookId) => {
    // Handle edit logic here
    console.log(`Editing book with ID: ${bookId}`);
  };

  const handleDeleteBook = (bookId) => {
    // Handle delete logic here
    console.log(`Deleting book with ID: ${bookId}`);
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Books</h1>
      {books.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Book ID</th>
              <th className="font-bold text-left py-2">Title</th>
              <th className="font-bold text-left py-2">Description</th>
              <th className="font-bold text-left py-2">Pages</th>
              <th className="font-bold text-left py-2">Year</th>
              <th className="font-bold text-left py-2">Publisher Name</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.BookID} className="border-b border-gray-300">
                <td className="py-2">{book.BookID}</td>
                <td className="py-2">{book.BookTitle}</td>
                <td className="py-2">{book.Description}</td>
                <td className="py-2">{book.Pages}</td>
                <td className="py-2">{book.PublicationYear}</td>
                <td className="py-2">{book.PublisherName}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEditBook(book.BookID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDeleteBook(book.BookID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No books available</p>
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

export default BooksPage;