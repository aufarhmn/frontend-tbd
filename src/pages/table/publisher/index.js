import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const PublisherPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Publisher/`);
        const sortedData = response.data.sort((a, b) => a.PublisherID - b.PublisherID);
        setData(sortedData);
        console.log(sortedData);
      } catch (error) {
        console.error('Error fetching publishers:', error);
        alert('Error fetching publishers');
      }
    };

    fetchInfo();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (publisherId) => {
    try {
      const editedPublisher = data.find((publisher) => publisher.PublisherID === publisherId);

      if (!editedPublisher) {
        console.error(`Publisher with ID ${publisherId} not found.`);
        return;
      }

      const updatedName = prompt('Enter the updated Publisher Name:', editedPublisher.PublisherName);
      const updatedYearFounded = prompt('Enter the updated Year Founded:', editedPublisher.YearFounded);

      if (!updatedName && !updatedYearFounded) {
        console.log('No fields were updated.');
        return;
      }

      const updatedPublisher = {
        PublisherID: publisherId,
        PublisherName: updatedName || editedPublisher.PublisherName,
        YearFounded: updatedYearFounded || editedPublisher.YearFounded,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Publisher/${publisherId}`, updatedPublisher);

      setData((prevData) =>
        prevData.map((publisher) => (publisher.PublisherID === publisherId ? updatedPublisher : publisher))
      );

      alert('Publisher updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing publisher:', error);
      alert('Error editing publisher');
    }
  };

  const handleDelete = async (publisherId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Publisher/${publisherId}`);
      alert('Publisher deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting publisher! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const existingIds = data.map((publisher) => publisher.PublisherID);
      const newPublisherID = Math.max(...existingIds) + 1;

      const newPublisher = {
        PublisherID: newPublisherID,
        AddressID: prompt('Enter the Address ID:'),
        PublisherName: prompt('Enter the Publisher Name:'),
        YearFounded: prompt('Enter the Year Founded:'),
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Publisher/`, newPublisher);

      setData((prevData) => [...prevData, newPublisher]);

      alert('Publisher added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding publisher');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Publisher</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Publisher ID</th>
              <th className="font-bold text-left py-2">Publisher Name</th>
              <th className="font-bold text-left py-2">Year Founded</th>
                <th className="font-bold text-left py-2">Street</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((publisher) => (
              <tr key={publisher.PublisherID} className="border-b border-gray-300">
                <td className="py-2">{publisher.PublisherID}</td>
                <td className="py-2">{publisher.PublisherName}</td>
                <td className="py-2">{publisher.YearFounded}</td>
                <td className="py-2">{publisher.Street}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(publisher.PublisherID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(publisher.PublisherID)}
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
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4 mr-2"
          onClick={handleAdd}
        >
          Add Publisher
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
          onClick={handleGoBack}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default PublisherPage;