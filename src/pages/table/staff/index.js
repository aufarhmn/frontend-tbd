import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const StaffPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedStaffIds, setSelectedStaffIds] = useState([]);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Staff/`);
        const sortedData = response.data.sort((a, b) => a.StaffID - b.StaffID);
        setData(sortedData);
        console.log(sortedData);
      } catch (error) {
        console.error('Error fetching staff:', error);
        alert('Error fetching staff');
      }
    };

    fetchStaff();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (staffId) => {
    try {
      const editedStaff = data.find((staff) => staff.StaffID === staffId);

      if (!editedStaff) {
        console.error(`Staff with ID ${staffId} not found.`);
        return;
      }

      const updatedAddressId = prompt('Enter the updated Address ID:', editedStaff.AddressID);
      const updatedStoreId = prompt('Enter the updated Store ID:', editedStaff.StoreID);
      const updatedFirstName = prompt('Enter the updated First Name:', editedStaff.FirstName);
      const updatedLastName = prompt('Enter the updated Last Name:', editedStaff.LastName);

      if (!updatedFirstName && !updatedLastName) {
        console.log('No fields were updated.');
        return;
      }

      const updatedStaff = {
        StaffID: staffId,
        AddressID: updatedAddressId || editedStaff.AddressID,
        StoreID: updatedStoreId || editedStaff.StoreID,
        FirstName: updatedFirstName || editedStaff.FirstName,
        LastName: updatedLastName || editedStaff.LastName,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Staff/${staffId}`, updatedStaff);

      setData((prevData) =>
        prevData.map((staff) => (staff.StaffID === staffId ? updatedStaff : staff))
      );

      alert('Staff updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing staff:', error);
      alert('Error editing staff');
    }
  };

  const handleDelete = async (staffId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Staff/${staffId}`);
      alert('Staff deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting staff! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const existingIds = data.map((staff) => staff.StaffID);
      const newStaffID = Math.max(...existingIds) + 1;

      const newStaff = {
        StaffID: newStaffID,
        AddressID: prompt('Enter the Address ID:'),
        StoreID: prompt('Enter the Store ID:'),
        FirstName: prompt('Enter the First Name:'),
        LastName: prompt('Enter the Last Name:'),
      };

      console.log(newStaff)

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Staff/`, newStaff);

      setData((prevData) => [...prevData, newStaff]);

      alert('Staff added successfully!');
      router.reload();
    } catch (error) {
        console.error('Error adding staff:', error);
      alert('Error adding staff');
    }
  };

//   const handleSelectStaff = (staffId) => {
//     setSelectedStaffIds((prevSelectedStaffIds) => {
//       if (prevSelectedStaffIds.includes(staffId)) {
//         return prevSelectedStaffIds.filter((id) => id !== staffId);
//       } else {
//         return [...prevSelectedStaffIds, staffId];
//       }
//     });
//   };

//   const handleEditMultiple = async () => {
//     try {
//       if (selectedStaffIds.length === 0) {
//         alert('Please select at least one staff to edit.');
//         return;
//       }

//       const updatedStaff = selectedStaffIds.map((staffId) => {
//         const staff = data.find((staff) => staff.StaffID === staffId);
//         const updatedFirstName = prompt('Enter the updated First Name:', staff.FirstName);
//         const updatedLastName = prompt('Enter the updated Last Name:', staff.LastName);

//         return {
//           StaffID: staffId,
//           AddressID: staff.AddressID,
//           StoreID: staff.StoreID,
//           FirstName: updatedFirstName || staff.FirstName,
//           LastName: updatedLastName || staff.LastName,
//         };
//       });

//       const requestBody = {
//         staff: updatedStaff,
//       };

//       await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Staff/edit-multiple`, requestBody);

//       setData((prevData) =>
//         prevData.map((staff) => {
//           if (selectedStaffIds.includes(staff.StaffID)) {
//             const updatedStaff = updatedStaff.find((updatedStaff) => updatedStaff.StaffID === staff.StaffID);
//             return { ...staff, ...updatedStaff };
//           }
//           return staff;
//         })
//       );

//       alert('Staff updated successfully!');
//       router.reload();
//     } catch (error) {
//       console.error('Error editing staff:', error);
//       alert('Error editing staff');
//     }
//   };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Staff</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Staff ID</th>
              <th className="font-bold text-left py-2">Address ID</th>
              <th className="font-bold text-left py-2">Store ID</th>
              <th className="font-bold text-left py-2">First Name</th>
              <th className="font-bold text-left py-2">Last Name</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((staff) => (
              <tr key={staff.StaffID} className="border-b border-gray-300">
                <td className="py-2">{staff.StaffID}</td>
                <td className="py-2">{staff.AddressID}</td>
                <td className="py-2">{staff.StoreID}</td>
                <td className="py-2">{staff.FirstName}</td>
                <td className="py-2">{staff.LastName}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(staff.StaffID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(staff.StaffID)}
                  >
                    Delete
                  </button>
                  {/* <button
                    className={`bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded ${
                      selectedStaffIds.includes(staff.StaffID) ? 'bg-green-700' : ''
                    }`}
                    onClick={() => handleSelectStaff(staff.StaffID)}
                  >
                    {selectedStaffIds.includes(staff.StaffID) ? 'Selected' : 'Select'}
                  </button> */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No staff found.</p>
      )}
      <div className="mt-8">
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handleAdd}
        >
          Add Staff
        </button>
        {/* <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
          onClick={handleEditMultiple}
        >
          Edit Selected
        </button> */}
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          onClick={handleGoBack}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default StaffPage;
