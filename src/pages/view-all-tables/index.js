import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';

const ViewAllTablesPage = () => {
  const router = useRouter();
  const [tablesData, setTablesData] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const [tableData, setTableData] = useState(null);

  useEffect(() => {
    const fetchTablesData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/sqlbuilders/table`);
        setTablesData(response.data);
      } catch (error) {
        console.error('Error fetching tables data:', error);
      }
    };

    fetchTablesData();
  }, []);

  const handleViewTableContent = async (tableName) => {
    setSelectedTable(tableName);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/sqlbuilders/table`, {
        tableName: tableName
      });
      setTableData(response.data);
    } catch (error) {
      console.error('Error fetching table data:', error);
    }
  };

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">View All Tables</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tablesData?.tables.map((tableName, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300"
          >
            <h2 className="text-lg font-bold mb-4 text-center">{tableName}</h2>
            <div className="flex justify-center">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={() => handleViewTableContent(tableName)}
              >
                View Table Content
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedTable && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg max-w-2xl overflow-y-scroll max-h-96">
            <h2 className="text-lg font-bold mb-4">Table: {selectedTable}</h2>
            {tableData ? (
              <ul className="list-none">
                {Object.entries(tableData).map(([key, value]) => (
                  <li key={key} className="mb-2">
                    <span className="font-semibold">{key}: </span>
                    {typeof value === 'object' ? (
                      <ul className="list-none ml-4">
                        {Object.entries(value).map(([subKey, subValue]) => (
                          <li key={subKey} className="mb-2">
                            <span className="font-semibold">{subKey}: </span>
                            {subValue}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      value
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p>Loading table data...</p>
            )}
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
              onClick={() => {
                setSelectedTable(null);
                setTableData(null);
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
      <div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 mt-8"
          onClick={handleGoBack}
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default ViewAllTablesPage;