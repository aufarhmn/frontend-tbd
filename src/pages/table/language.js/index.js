import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const LanguagePage = () => {
  const router = useRouter();
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/Language/`);
        const sorted = response.data.sort((a, b) => a.LanguageID - b.LanguageID);
        setData(sorted);
        console.log(response.data);
      } catch (error) {
        console.error('Error fetching languages:', error);
        alert('Error fetching languages');
      }
    };

    fetchLanguages();
  }, []);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleEdit = async (languageId) => {
    try {
      const editedLanguage = data.find((language) => language.LanguageID === languageId);

      if (!editedLanguage) {
        console.error(`Language with ID ${languageId} not found.`);
        return;
      }

      const updatedLanguageName = prompt('Enter the updated Language Name:', editedLanguage.LanguageName);

      if (!updatedLanguageName) {
        console.log('No fields were updated.');
        return;
      }

      const updatedLanguage = {
        LanguageID: languageId,
        LanguageName: updatedLanguageName,
      };

      console.log(updatedLanguage)

      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/Language/${languageId}`, updatedLanguage);

      setData((prevData) =>
        prevData.map((language) => (language.LanguageID === languageId ? updatedLanguage : language))
      );

      alert('Language updated successfully!');
      router.reload();
    } catch (error) {
      console.error('Error editing language:', error);
      alert('Error editing language');
    }
  };

  const handleDelete = async (languageId) => {
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/Language/${languageId}`);
      alert('Language deleted successfully!');
      router.reload();
    } catch (error) {
      alert('Error deleting language! Please check all Foreign Key constraints');
    }
  };

  const handleAdd = async () => {
    try {
      const newLanguageName = prompt('Enter the Language Name:');

      if (!newLanguageName) {
        console.log('No language name provided.');
        return;
      }

      const newLanguage = {
        LanguageID: data.length + 1,
        LanguageName: newLanguageName,
      };

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/Language/`, newLanguage);

      setData((prevData) => [...prevData, newLanguage]);

      alert('Language added successfully!');
      router.reload();
    } catch (error) {
      alert('Error adding language');
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">Language</h1>
      {data.length > 0 ? (
        <table className="w-full">
          <thead>
            <tr>
              <th className="font-bold text-left py-2">Language ID</th>
              <th className="font-bold text-left py-2">Language Name</th>
              <th className="font-bold text-left py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((language) => (
              <tr key={language.LanguageID} className="border-b border-gray-300">
                <td className="py-2">{language.LanguageID}</td>
                <td className="py-2">{language.LanguageName}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleEdit(language.LanguageID)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mr-2"
                    onClick={() => handleDelete(language.LanguageID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No languages available</p>
      )}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8"
          onClick={handleAdd}
        >
          Add Language
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

export default LanguagePage;