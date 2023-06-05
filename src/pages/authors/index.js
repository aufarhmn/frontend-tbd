import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AuthorPages = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/author/`);
        const sortedData = response.data.sort((a, b) => a.AuthorID - b.AuthorID);
        setData(sortedData);
        console.log(sortedData);
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
  
  const handleEdit = async (authorsId) => {
    try {
      const edited = data.find((edited) => edited.AuthorID === authorsId);

      if (!edited) {
        console.error(`Author with ID ${authorsId} not found.`);
        return;
      }

      const updatedFirstName = prompt('Enter the updated First Name:', edited.FirstName);
      const updatedLastName = prompt('Enter the updated Last Name:', edited.LastName);
      const updatedYearBorn = prompt('Enter the updated Year Born:', edited.YearBorn);
      const updatedYearDied = prompt('Enter the updated Year Died:', edited.YearDied === null ? "" : (edited.YearDied || ""));

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
        FirstName: updatedFirstName || edited.FirstName,
        LastName: updatedLastName || edited.LastName,
        YearBorn: updatedYearBorn || edited.YearBorn,
        YearDied: updatedYearDied || edited.YearDied,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/author/${authorsId}`, updatedAuthor);

      setData((prevData) =>
        prevData.map((prevData) => (prevData.AuthorId === authorsId ? updatedAuthor : prevData))
      );

      alert('Author updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing author:', error);
      alert('Error editing author');
    }
  };

  const handleDelete = async (authorsId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/author/${authorsId}`);
      alert('Author deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting author! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const existingIds = data.map((data) => data.AuthorID);
      const newAuthorID = Math.max(...existingIds) + 1;
      
      const newAuthor = { 
        AuthorID: newAuthorID,
        FirstName: prompt('Enter the First Name:'),
        LastName: prompt('Enter the Last Name:'),
        YearBorn: prompt('Enter the Year Born:'),
        YearDied: prompt('Enter the Year Died:'),
      };
      
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/author/`, newAuthor);

      setData((prevData) => [...prevData, newAuthor]);

      alert('Author added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding author');
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
            {data.map((data) => (
              <tr key={data.AuthorID} className="border-b border-gray-300">
                <td className="py-2">{data.AuthorID}</td>
                <td className="py-2">{data.FirstName}</td>
                <td className="py-2">{data.LastName}</td>
                <td className="py-2">{data.YearBorn}</td>
                <td className="py-2">{data.YearDied}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(data.AuthorID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDelete(data.AuthorID)}
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
          onClick={handleAdd}
        >
          Add Author
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