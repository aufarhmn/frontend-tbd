import React from 'react';
import Link from 'next/link';

const DashboardPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-2xl font-bold mb-8">PostgreSQL Interface</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="flex flex-col justify-between bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
          <div className="mb-4">
            <h2 className="text-lg text-center font-bold"> View All Table (RAW)</h2>
          </div>
          <div className="text-center">
            <Link legacyBehavior href="/view-all-tables">
              <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Click Here!
              </a>
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
          <div className="mb-4">
            <h2 className="text-lg text-center font-bold">Execute SQL Command</h2>
          </div>
          <div className="text-center">
            <Link legacyBehavior href="/sql-command-raw">
              <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Click Here!
              </a>
            </Link>
          </div>
        </div>
        <div className="flex flex-col justify-between bg-white p-6 rounded-lg shadow hover:shadow-lg transition duration-300">
          <div className="mb-4">
            <h2 className="text-lg text-center font-bold">Menu Item 3</h2>
          </div>
          <div className="text-center">
            <Link legacyBehavior href="/menu-item-3">
              <a className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Click Here!
              </a>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;