import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const StorePages = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Store/`);
        const sortedData = response.data.sort((a, b) => a.StoreID - b.StoreID);
        setData(sortedData);
        console.log(sortedData);
      } catch (error) {
        console.error('Error fetching stores:', error);
        alert('Error fetching stores');
      }
    };

    fetchData();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (storeId) => {
    try {
      const editedStore = data.find((store) => store.StoreID === storeId);

      if (!editedStore) {
        console.error(`Store with ID ${storeId} not found.`);
        return;
      }

      const updatedName = prompt('Enter the updated name:', editedStore.StoreName);
      const updatedYearBuilt = prompt('Enter the updated location:', editedStore.YearBuilt);
      const updatedSizeOfBuilding = prompt('Enter the updated size:', editedStore.SizeOfBuilding);

      if (!updatedName && !updatedYearBuilt && !updatedSizeOfBuilding) {
        console.log('No fields were updated.');
        return;
      }

      const updatedStore = {
        StoreID: storeId,
        StoreName: updatedName || editedStore.StoreName,
        YearBuilt: updatedYearBuilt || editedStore.YearBuilt,
        SizeOfBuilding: updatedSizeOfBuilding || editedStore.SizeOfBuilding,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Store/${storeId}`, updatedStore);

      setData((prevData) =>
        prevData.map((store) => (store.StoreID === storeId ? updatedStore : store))
      );

      alert('Store updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing store:', error);
      alert('Error editing store');
    }
  };

  const handleDelete = async (storeId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Store/${storeId}`);
      alert('Store deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting store! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const existingIds = data.map((store) => store.StoreID);
      const newStoreID = Math.max(...existingIds) + 1;

      const newStore = {
        StoreID: newStoreID,
        AddressID: prompt('Enter the Address ID:'),
        StoreName: prompt('Enter the Store Name:'),
        YearBuilt: prompt('Enter the Year Built:'),
        SizeOfBuilding: prompt('Enter the Size of Building:'),
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Store/`, newStore);

      setData((prevData) => [...prevData, newStore]);

      alert('Store added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding store');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Store</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Store ID</th>
              <th className="font-bold text-left py-2">Address ID</th>
              <th className="font-bold text-left py-2">Store Name</th>
              <th className="font-bold text-left py-2">Street</th>
              <th className="font-bold text-left py-2">Year Built</th>
              <th className="font-bold text-left py-2">Size of Building</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((store) => (
              <tr key={store.StoreID} className="border-b border-gray-300">
                <td className="py-2">{store.StoreID}</td>
                <td className="py-2">{store.AddressID}</td>
                <td className="py-2">{store.StoreName}</td>
                <td className="py-2">{store.Street}</td>
                <td className="py-2">{store.YearBuilt}</td>
                <td className="py-2">{store.SizeOfBuilding}</td> 
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(store.StoreID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(store.StoreID)}
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
          Add Store
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

export default StorePages;