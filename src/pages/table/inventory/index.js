import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const InventoryPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedInventoryIds, setSelectedInventoryIds] = useState([]);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Inventory/`);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching inventory:', error);
        alert('Error fetching inventory');
      }
    };

    fetchInventory();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (inventoryId) => {
    try {
      const editedInventory = data.find((inventory) => inventory.InventoryID === inventoryId);

      if (!editedInventory) {
        console.error(`Inventory with ID ${inventoryId} not found.`);
        return;
      }

      const updatedQuantity = prompt('Enter the updated Quantity:', editedInventory.Quantity);

      if (!updatedQuantity) {
        console.log('No fields were updated.');
        return;
      }

      const updatedInventory = {
        InventoryID: inventoryId,
        Quantity: updatedQuantity,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Inventory/${inventoryId}`, updatedInventory);

      setData((prevData) =>
        prevData.map((inventory) => (inventory.InventoryID === inventoryId ? updatedInventory : inventory))
      );

      alert('Inventory updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing inventory:', error);
      alert('Error editing inventory');
    }
  };

  const handleDelete = async (inventoryId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Inventory/${inventoryId}`);
      alert('Inventory deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting inventory! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const BookID = prompt('Enter the Book ID:');
      const StoreID = prompt('Enter the Store ID:');
      const newQuantity = prompt('Enter the Quantity:');

      if (!newQuantity) {
        console.log('No quantity provided.');
        return;
      }

      const newInventory = {
        InventoryID: data.length + 1,
        BookID,
        StoreID,
        Quantity: newQuantity,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Inventory/`, newInventory);

      setData((prevData) => [...prevData, newInventory]);

      alert('Inventory added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding inventory');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Inventory</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Inventory ID</th>
              <th className="font-bold text-left py-2">Book ID</th>
                <th className="font-bold text-left py-2">Book Title</th>
              <th className="font-bold text-left py-2">Store ID</th>
                <th className="font-bold text-left py-2">Store Name</th>
              <th className="font-bold text-left py-2">Quantity</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((inventory) => (
              <tr key={inventory.InventoryID} className="border-b border-gray-300">
                <td className="py-2">{inventory.InventoryID}</td>
                <td className="py-2">{inventory.BookID}</td>
                <td className="py-2">{inventory.BookTitle}</td>
                <td className="py-2">{inventory.StoreID}</td>
                <td className="py-2">{inventory.StoreName}</td>
                <td className="py-2">{inventory.Quantity}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(inventory.InventoryID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(inventory.InventoryID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No inventory available</p>
      )}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8"
          onClick={handleAdd}
        >
          Add Inventory
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

export default InventoryPage;