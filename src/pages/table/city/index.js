import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const CityPage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/City/`);
        setData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        alert('Error fetching cities');
      }
    };

    fetchCities();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (cityId) => {
    try {
      const editedCity = data.find((city) => city.CityID === cityId);

      if (!editedCity) {
        console.error(`City with ID ${cityId} not found.`);
        return;
      }

      const updatedCityName = prompt('Enter the updated City Name:', editedCity.CityName);

      if (!updatedCityName) {
        console.log('No fields were updated.');
        return;
      }

      const updatedCity = {
        CityID: cityId,
        CityName: updatedCityName,
      };

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/City/${cityId}`, updatedCity);

      setData((prevData) =>
        prevData.map((city) => (city.CityID === cityId ? updatedCity : city))
      );

      alert('City updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing city:', error);
      alert('Error editing city');
    }
  };

  const handleDelete = async (cityId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/City/${cityId}`);
      alert('City deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting city! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const newCountryId = prompt('Enter the Country ID:');
      const newCityName = prompt('Enter the City Name:');

      if (!newCityName) {
        console.log('No city name provided.');
        return;
      }

      const newCity = {
        CityID: data.length + 1,
        CountryID: newCountryId,
        CityName: newCityName,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/City/`, newCity);

      setData((prevData) => [...prevData, newCity]);

      alert('City added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding city');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">City</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">City ID</th>
              <th className="font-bold text-left py-2">City Name</th>
                <th className="font-bold text-left py-2">Country ID</th>
                <th className="font-bold text-left py-2">Country Name</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((city) => (
              <tr key={city.CityID} className="border-b border-gray-300">
                <td className="py-2">{city.CityID}</td>
                <td className="py-2">{city.CityName}</td>
                <td className="py-2">{city.CountryID}</td>
                <td className="py-2">{city.CountryName}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(city.CityID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(city.CityID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No cities available</p>
      )}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8"
          onClick={handleAdd}
        >
          Add City
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

export default CityPage;