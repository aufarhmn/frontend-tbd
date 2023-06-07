import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const CountryPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [selectedCountryIds, setSelectedCountryIds] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Country/`);
        const sorted = response.data.sort((a, b) => a.CountryID - b.CountryID);
        setData(sorted);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching countries:', error);
        alert('Error fetching countries');
      }
    };

    fetchCountries();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (countryId) => {
    try {
      const editedCountry = data.find((country) => country.CountryID === countryId);

      if (!editedCountry) {
        console.error(`Country with ID ${countryId} not found.`);
        return;
      }

      const updatedCountryName = prompt('Enter the updated Country Name:', editedCountry.CountryName);

      if (!updatedCountryName) {
        console.log('No fields were updated.');
        return;
      }

      const updatedCountry = {
        CountryID: countryId,
        CountryName: updatedCountryName,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Country/${countryId}`, updatedCountry);

      setData((prevData) =>
        prevData.map((country) => (country.CountryID === countryId ? updatedCountry : country))
      );

      alert('Country updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing country:', error);
      alert('Error editing country');
    }
  };

  const handleDelete = async (countryId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Country/${countryId}`);
      alert('Country deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting country! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const newCountryName = prompt('Enter the Country Name:');

      if (!newCountryName) {
        console.log('No country name provided.');
        return;
      }

      const newCountry = {
        CountryID: data.length + 1,
        CountryName: newCountryName,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Country/`, newCountry);

      setData((prevData) => [...prevData, newCountry]);

      alert('Country added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding country');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Country</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Country ID</th>
              <th className="font-bold text-left py-2">Country Name</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((country) => (
              <tr key={country.CountryID} className="border-b border-gray-300">
                <td className="py-2">{country.CountryID}</td>
                <td className="py-2">{country.CountryName}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(country.CountryID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(country.CountryID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No countries available</p>
      )}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8"
          onClick={handleAdd}
        >
          Add Country
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

export default CountryPage;