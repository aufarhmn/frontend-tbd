import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const AddressPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Address/`);
        const sortedData = response.data.sort((a, b) => a.AddressID - b.AddressID);
        setData(sortedData);
      } catch (error) {
        console.error('Error fetching addresses:', error);
        alert('Error fetching addresses');
      }
    };

    fetchData();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (addressId) => {
    try {
      const editedAddress = data.find((address) => address.AddressID === addressId);

      if (!editedAddress) {
        console.error(`Address with ID ${addressId} not found.`);
        return;
      }

      const updatedStreet = prompt('Enter the updated Street:', editedAddress.Street);
      const updatedPostalCode = prompt('Enter the updated Postal Code:', editedAddress.PostalCode);
      const updatedState = prompt('Enter the updated State:', editedAddress.State);
      const updatedPhoneNumber = prompt('Enter the updated Phone Number:', editedAddress.PhoneNumber);

      if (
        !updatedStreet &&
        !updatedPostalCode &&
        !updatedState &&
        !updatedPhoneNumber
      ) {
        alert('No fields were updated.');
        return;
      }

      const updatedAddress = {
        AddressID: addressId,
        CityID: editedAddress.CityID,
        Street: updatedStreet || editedAddress.Street,
        PostalCode: updatedPostalCode || editedAddress.PostalCode,
        State: updatedState || editedAddress.State,
        PhoneNumber: updatedPhoneNumber || editedAddress.PhoneNumber,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Address/${addressId}`, updatedAddress);

      setData((prevData) =>
        prevData.map((address) => (address.AddressID === addressId ? updatedAddress : address))
      );

      alert('Address updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing address:', error);
      alert('Error editing address');
    }
  };

  const handleDelete = async (addressId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Address/${addressId}`);
      alert('Address deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting address!');
    }
  };

  const handleAdd = async () => {
    try {
      const existingIds = data.map((address) => address.AddressID);
      const newAddressID = Math.max(...existingIds) + 1;

      const newAddress = {
        AddressID: newAddressID,
        CityID: prompt('Enter the City ID:'), 
        Street: prompt('Enter the Street:'),
        PostalCode: prompt('Enter the Postal Code:'),
        State: prompt('Enter the State:'),
        PhoneNumber: prompt('Enter the Phone Number:'),
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Address/`, newAddress);

      setData((prevData) => [...prevData, newAddress]);

      alert('Address added successfully!');
      router.reload();
    } catch (error) {
      console.error('Error adding address:', error);
      alert('Error adding address');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Address</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Address ID</th>
              <th className="font-bold text-left py-2">City ID</th>
                <th className="font-bold text-left py-2">Street</th>
              <th className="font-bold text-left py-2">Postal Code</th>
                <th className="font-bold text-left py-2">State</th>
              <th className="font-bold text-left py-2">Phone Number</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((address) => (
              <tr key={address.AddressID} className="border-b border-gray-300">
                <td className="py-2">{address.AddressID}</td>
                <td className="py-2">{address.CityID}</td>
                <td className="py-2">{address.Street}</td>
                <td className="py-2">{address.PostalCode}</td>
                <td className="py-2">{address.State}</td>
                <td className="py-2">{address.PhoneNumber}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(address.AddressID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(address.AddressID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No addresses available</p>
      )}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8"
          onClick={handleAdd}
        >
          Add Address
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

export default AddressPage;