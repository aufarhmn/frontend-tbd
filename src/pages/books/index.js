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

  const handleEditBook = async (bookId) => {
    try {
      const book = books.find((book) => book.BookID === bookId);
  
      if (!book) {
        console.error(`Book with ID ${bookId} not found.`);
        return;
      }

      const updatedTitle = prompt('Enter the updated title:', book.BookTitle);
      const updatedDescription = prompt('Enter the updated description:', book.Description);
      const updatedPublicationYear = prompt('Enter the updated publication year:', book.PublicationYear);
      const updatedPages = prompt('Enter the updated number of pages:', book.Pages);
  
      if (
        !updatedTitle &&
        !updatedDescription &&
        !updatedPublicationYear &&
        !updatedPages
      ) {
        console.log('No fields were updated.');
        return;
      }
  
      const updatedBook = {
        title: updatedTitle || book.BookTitle,
        description: updatedDescription || book.Description,
        publicationYear: updatedPublicationYear || book.PublicationYear,
        pages: updatedPages || book.Pages
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`, updatedBook);

      setBooks((prevBooks) =>
        prevBooks.map((prevBook) => (prevBook.BookID === bookId ? updatedBook : prevBook))
      );

      alert('Book updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing book:', error);
      alert('Error editing book');
    }
  };
  
  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/books/${bookId}`);
      alert('Book deleted successfully!');
      router.reload();
    } catch (error) {
      console.error(`Error deleting book with ID ${bookId}:`, error);
      alert('Error deleting book! Please check all Foreign Key constraints');
    }
  };
  
  const handleAddBook = async () => {
    try {
      const existingBookIds = books.map((book) => book.BookID);
      const newBookId = Math.max(...existingBookIds) + 1;

      const newBook = {
        BookID: newBookId,
        BookTitle: prompt('Enter the book title:'),
        Description: prompt('Enter the book description:'),
        PublicationYear: prompt('Enter the publication year:'),
        Pages: prompt('Enter the number of pages:'),
        PublisherID: prompt('Enter the publisher ID (Must be number):'),
        LanguageID: prompt('Enter the language ID (Must be number):')
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/books/`, newBook);

      setBooks((prevBooks) => [...prevBooks, newBook]);

      alert('Book added successfully!');
      router.reload();
    } catch (error) {
      console.error('Error adding book:', error);
      alert('Error adding book');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Books</h1>
      {books.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Book ID</th>
              <th className="font-bold text-left py-2">Publisher ID</th>
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
                <td className="py-2">{book.PublisherID}</td>
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
          onClick={handleAddBook}
        >
          Add Book
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

export default BooksPage;