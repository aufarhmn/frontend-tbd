import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthorPages = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedAuthorIds, setSelectedAuthorIds] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Author/`);
        const sortedData = response.data.sort((a, b) => a.AuthorID - b.AuthorID);
        setData(sortedData);
        console.log(sortedData);
      } catch (error) {
        console.error('Error fetching authors:', error);
        alert('Error fetching authors');
      }
    };

    fetchInfo();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (authorId) => {
    try {
      const editedAuthor = data.find((author) => author.AuthorID === authorId);

      if (!editedAuthor) {
        console.error(`Author with ID ${authorId} not found.`);
        return;
      }

      const updatedFirstName = prompt('Enter the updated First Name:', editedAuthor.FirstName);
      const updatedLastName = prompt('Enter the updated Last Name:', editedAuthor.LastName);
      const updatedYearBorn = prompt('Enter the updated Year Born:', editedAuthor.YearBorn);
      const updatedYearDied = prompt('Enter the updated Year Died:', editedAuthor.YearDied === null ? "" : (editedAuthor.YearDied || ""));

      if (
        !updatedFirstName &&
        !updatedLastName &&
        !updatedYearBorn &&
        !updatedYearDied
      ) {
        console.log('No fields were updated.');
        return;
      }

      const updatedAuthor = {
        AuthorID: authorId,
        FirstName: updatedFirstName || editedAuthor.FirstName,
        LastName: updatedLastName || editedAuthor.LastName,
        YearBorn: updatedYearBorn || editedAuthor.YearBorn,
        YearDied: updatedYearDied || editedAuthor.YearDied,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Author/${authorId}`, updatedAuthor);

      setData((prevData) =>
        prevData.map((author) => (author.AuthorID === authorId ? updatedAuthor : author))
      );

      alert('Author updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing author:', error);
      alert('Error editing author');
    }
  };

  const handleDelete = async (authorId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Author/${authorId}`);
      alert('Author deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting author! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const existingIds = data.map((author) => author.AuthorID);
      const newAuthorID = Math.max(...existingIds) + 1;

      const newAuthor = {
        AuthorID: newAuthorID,
        FirstName: prompt('Enter the First Name:'),
        LastName: prompt('Enter the Last Name:'),
        YearBorn: prompt('Enter the Year Born:'),
        YearDied: prompt('Enter the Year Died:'),
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Author/`, newAuthor);

      setData((prevData) => [...prevData, newAuthor]);

      alert('Author added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding author');
    }
  };

  const handleSelectAuthor = (authorId) => {
    setSelectedAuthorIds((prevSelectedAuthorIds) => {
      if (prevSelectedAuthorIds.includes(authorId)) {
        return prevSelectedAuthorIds.filter((id) => id !== authorId);
      } else {
        return [...prevSelectedAuthorIds, authorId];
      }
    });
  };

  const handleEditMultiple = async () => {
    try {
      if (selectedAuthorIds.length === 0) {
        alert('Please select at least one author to edit.');
        return;
      }

      const updatedAuthors = selectedAuthorIds.map((authorId) => {
        const author = data.find((author) => author.AuthorID === authorId);
        const updatedFirstName = prompt('Enter the updated First Name:', author.FirstName);
        const updatedLastName = prompt('Enter the updated Last Name:', author.LastName);
        const updatedYearBorn = prompt('Enter the updated Year Born:', author.YearBorn);
        const updatedYearDied = prompt('Enter the updated Year Died:', author.YearDied === null ? "" : (author.YearDied || ""));

        return {
          id: authorId,
          FirstName: updatedFirstName || author.FirstName,
          LastName: updatedLastName || author.LastName,
          YearBorn: updatedYearBorn || author.YearBorn,
          YearDied: updatedYearDied || author.YearDied,
        };
      });

      const requestBody = {
        authors: updatedAuthors,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Author/edit-multiple`, requestBody);

      setData((prevData) =>
        prevData.map((author) => {
          if (selectedAuthorIds.includes(author.AuthorID)) {
            const updatedAuthor = updatedAuthors.find((updatedAuthor) => updatedAuthor.id === author.AuthorID);
            return { ...author, ...updatedAuthor };
          }
          return author;
        })
      );

      alert('Authors updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing authors:', error);
      alert('Error editing authors');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Author</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Author ID</th>
              <th className="font-bold text-left py-2">Author First Name</th>
              <th className="font-bold text-left py-2">Author Last Name</th>
              <th className="font-bold text-left py-2">Year Born</th>
              <th className="font-bold text-left py-2">Year Died</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((author) => (
              <tr key={author.AuthorID} className="border-b border-gray-300">
                <td className="py-2">{author.AuthorID}</td>
                <td className="py-2">{author.FirstName}</td>
                <td className="py-2">{author.LastName}</td>
                <td className="py-2">{author.YearBorn}</td>
                <td className="py-2">{author.YearDied}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(author.AuthorID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(author.AuthorID)}
                  >
                    Delete
                  </button>
                  <button
                    className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ${
                      selectedAuthorIds.includes(author.AuthorID) ? 'bg-green-700' : ''
                    }`}
                    onClick={() => handleSelectAuthor(author.AuthorID)}
                  >
                    {selectedAuthorIds.includes(author.AuthorID) ? 'Selected' : 'Select'}
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
          onClick={handleAdd}
        >
          Add Author
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8 ml-4"
          onClick={handleEditMultiple}
        >
          Edit Selected Authors
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

export default AuthorPages;