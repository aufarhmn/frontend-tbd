import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const GenrePage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Genre/`);
        const sortedData = response.data.sort((a, b) => a.GenreID - b.GenreID);
        setData(sortedData);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching genres:', error);
        alert('Error fetching genres');
      }
    };

    fetchGenres();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (genreId) => {
    try {
      const editedGenre = data.find((genre) => genre.GenreID === genreId);

      if (!editedGenre) {
        console.error(`Genre with ID ${genreId} not found.`);
        return;
      }

      const updatedGenreName = prompt('Enter the updated Genre Name:', editedGenre.GenreName);

      if (!updatedGenreName) {
        console.log('No fields were updated.');
        return;
      }

      const updatedGenre = {
        GenreID: genreId,
        GenreName: updatedGenreName,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Genre/${genreId}`, updatedGenre);

      setData((prevData) =>
        prevData.map((genre) => (genre.GenreID === genreId ? updatedGenre : genre))
      );

      alert('Genre updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing genre:', error);
      alert('Error editing genre');
    }
  };

  const handleDelete = async (genreId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Genre/${genreId}`);
      alert('Genre deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting genre! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const newGenreName = prompt('Enter the Genre Name:');

      if (!newGenreName) {
        console.log('No genre name provided.');
        return;
      }

      const newGenre = {
        GenreID: data.length + 1,
        GenreName: newGenreName,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Genre/`, newGenre);

      setData((prevData) => [...prevData, newGenre]);

      alert('Genre added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding genre');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Genre</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Genre ID</th>
              <th className="font-bold text-left py-2">Genre Name</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((genre) => (
              <tr key={genre.GenreID} className="border-b border-gray-300">
                <td className="py-2">{genre.GenreID}</td>
                <td className="py-2">{genre.GenreName}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(genre.GenreID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(genre.GenreID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No genres available</p>
      )}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8"
          onClick={handleAdd}
        >
          Add Genre
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

export default GenrePage;