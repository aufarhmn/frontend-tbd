import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const CustomerPages = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedCustomerIds, setSelectedCustomerIds] = useState([]);

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Customer/`);
        const sortedData = response.data.sort((a, b) => a.CustomerID - b.CustomerID);
        setData(sortedData);
        console.log(sortedData);
      } catch (error) {
        console.error('Error fetching customers:', error);
        alert('Error fetching customers');
      }
    };

    fetchInfo();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (customerId) => {
    try {
      const editedCustomer = data.find((customer) => customer.CustomerID === customerId);

      if (!editedCustomer) {
        console.error(`Customer with ID ${customerId} not found.`);
        return;
      }
      
      const updatedFirstName = prompt('Enter the updated First Name:', editedCustomer.FirstName);
      const updatedLastName = prompt('Enter the updated Last Name:', editedCustomer.LastName);

      if (!updatedFirstName && !updatedLastName) {
        console.log('No fields were updated.');
        return;
      }

      const updatedCustomer = {
        CustomerID: customerId,
        StoreID: editedCustomer.StoreID,
        AddressID: editedCustomer.AddressID,
        FirstName: updatedFirstName || editedCustomer.FirstName,
        LastName: updatedLastName || editedCustomer.LastName,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Customer/${customerId}`, updatedCustomer);

      setData((prevData) =>
        prevData.map((customer) => (customer.CustomerID === customerId ? updatedCustomer : customer))
      );

      alert('Customer updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing customer:', error);
      alert('Error editing customer');
    }
  };

  const handleDelete = async (customerId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Customer/${customerId}`);
      alert('Customer deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting customer! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const existingIds = data.map((customer) => customer.CustomerID);
      const newCustomerId = Math.max(...existingIds) + 1;

      const newCustomer = {
        CustomerID: newCustomerId,
        StoreID: prompt('Enter the Store ID:'),
        AddressID: prompt('Enter the Address ID:'),
        FirstName: prompt('Enter the First Name:'),
        LastName: prompt('Enter the Last Name:'),
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Customer/`, newCustomer);

      setData((prevData) => [...prevData, newCustomer]);

      alert('Customer added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding customer');
    }
  };

//   const handleSelectCustomer = (customerId) => {
//     setSelectedCustomerIds((prevSelectedCustomerIds) => {
//       if (prevSelectedCustomerIds.includes(customerId)) {
//         return prevSelectedCustomerIds.filter((id) => id !== customerId);
//       } else {
//         return [...prevSelectedCustomerIds, customerId];
//       }
//     });
//   };

//   const handleEditMultiple = async () => {
//     try {
//       if (selectedCustomerIds.length === 0) {
//         alert('Please select at least one customer to edit.');
//         return;
//       }

//       const updatedCustomers = selectedCustomerIds.map((customerId) => {
//         const customer = data.find((customer) => customer.CustomerID === customerId);
//         const updatedFirstName = prompt('Enter the updated First Name:', customer.FirstName);
//         const updatedLastName = prompt('Enter the updated Last Name:', customer.LastName);

//         return {
//           id: customerId,
//           StoreID: customer.StoreID,
//           AddressID: customer.AddressID,
//           FirstName: updatedFirstName || customer.FirstName,
//           LastName: updatedLastName || customer.LastName,
//         };
//       });

//       const requestBody = {
//         customers: updatedCustomers,
//       };

//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Customer/edit-multiple`, requestBody);

//       setData((prevData) =>
//         prevData.map((customer) => {
//           if (selectedCustomerIds.includes(customer.CustomerID)) {
//             const updatedCustomer = updatedCustomers.find((updatedCustomer) => updatedCustomer.id === customer.CustomerID);
//             return { ...customer, ...updatedCustomer };
//           }
//           return customer;
//         })
//       );

//       alert('Customers updated successfully!');
//       router.reload();
//     } catch (error) {
//       console.error('Error editing customers:', error);
//       alert('Error editing customers');
//     }
//   };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Customer</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Customer ID</th>
              <th className="font-bold text-left py-2">Store ID</th>
              <th className="font-bold text-left py-2">Address ID</th>
              <th className="font-bold text-left py-2">First Name</th>
              <th className="font-bold text-left py-2">Last Name</th>
              <th className="font-bold text-left py-2">Store Name</th>
              <th className="font-bold text-left py-2">Street</th>   
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((customer) => (
              <tr key={customer.CustomerID} className="border-b border-gray-300">
                <td className="py-2">{customer.CustomerID}</td>
                <td className="py-2">{customer.StoreID}</td>
                <td className="py-2">{customer.AddressID}</td>
                <td className="py-2">{customer.FirstName}</td>
                <td className="py-2">{customer.LastName}</td>
                <td className="py-2">{customer.StoreName}</td>
                <td className="py-2">{customer.Street}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(customer.CustomerID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(customer.CustomerID)}
                  >
                    Delete
                  </button>
                  {/* <button
                    className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ${
                      selectedCustomerIds.includes(customer.CustomerID) ? 'bg-green-700' : ''
                    }`}
                    onClick={() => handleSelectCustomer(customer.CustomerID)}
                  >
                    {selectedCustomerIds.includes(customer.CustomerID) ? 'Selected' : 'Select'}
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No customers found.</p>
      )}
      <div className="mt-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handleAdd}
        >
          Add Customer
        </button>
        {/* <button
          className={`bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ${
            selectedCustomerIds.length > 0 ? '' : 'opacity-50 cursor-not-allowed'
          }`}
          onClick={handleEditMultiple}
          disabled={selectedCustomerIds.length === 0}
        >
          Edit Selected
        </button> */}
        <button className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleGoBack}>
        Back to Dashboard
      </button>
      </div>
    </div>
  );
};

export default CustomerPages;
