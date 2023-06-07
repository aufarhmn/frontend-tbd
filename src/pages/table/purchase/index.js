import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const PurchasePage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Purchase/`);
        const sortedPurchase = response.data.sort((a, b) => a.PurchaseID - b.PurchaseID);
        setData(sortedPurchase);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching purchases:', error);
        alert('Error fetching purchases');
      }
    };

    fetchPurchases();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (purchaseId) => {
    try {
      const editedPurchase = data.find((purchase) => purchase.PurchaseID === purchaseId);

      if (!editedPurchase) {
        console.error(`Purchase with ID ${purchaseId} not found.`);
        return;
      }

      const updatedAmount = prompt('Enter the updated Amount:', editedPurchase.Amount);

      if (!updatedAmount) {
        console.log('No fields were updated.');
        return;
      }

      const updatedPurchase = {
        PurchaseID: purchaseId,
        Amount: updatedAmount,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Purchase/${purchaseId}`, updatedPurchase);

      setData((prevData) =>
        prevData.map((purchase) => (purchase.PurchaseID === purchaseId ? updatedPurchase : purchase))
      );

      alert('Purchase updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing purchase:', error);
      alert('Error editing purchase');
    }
  };

  const handleDelete = async (purchaseId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Purchase/${purchaseId}`);
      alert('Purchase deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting purchase! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const existingIds = data.map((purchase) => purchase.PurchaseID);
      const newPurchaseID = Math.max(...existingIds) + 1;

      const newPurchase = {
        PurchaseID: newPurchaseID,
        CustomerID: prompt('Enter the Customer ID:'),
        StaffID: prompt('Enter the Staff ID:'),
        StoreID: prompt('Enter the Store ID:'),
        InventoryID: prompt('Enter the Inventory ID:'),
        Amount: prompt('Enter the Amount:'),
        PurchaseDate: prompt('Enter the Purchase Date:'),
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Purchase/`, newPurchase);

      setData((prevData) => [...prevData, newPurchase]);

      alert('Purchase added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding purchase');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Purchase</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Purchase ID</th>
              <th className="font-bold text-left py-2">Amount</th>
              <th className="font-bold text-left py-2">Book Title</th>
              <th className="font-bold text-left py-2">Customer First Name</th>
              <th className="font-bold text-left py-2">Purchase Date</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((purchase) => (
              <tr key={purchase.PurchaseID} className="border-b border-gray-300">
                <td className="py-2">{purchase.PurchaseID}</td>
                <td className="py-2">{purchase.Amount}</td>
                <td className="py-2">{purchase.BookTitle}</td>
                <td className="py-2">{purchase.FirstName}</td>
                <td className="py-2">{purchase.PurchaseDate}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(purchase.PurchaseID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(purchase.PurchaseID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No purchases available</p>
      )}
      <div>
      <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8 ml-4"
          onClick={handleAdd}
        >
          Add Purchase
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

export default PurchasePage;