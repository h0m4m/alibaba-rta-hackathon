// DashboardPage.js
import React, { useState } from 'react';
import AccidentMap from '../components/accidentmap'; // Import the AccidentMap component

const DashboardPage = ({ user, onLogout }) => {
  const [nearbyHotspots, setNearbyHotspots] = useState(0);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      {/* Header Section */}
      <div className="flex items-center justify-between w-full max-w-6xl mx-auto">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-bold text-primary">
            Hello, {user.firstName} {user.lastName}
          </h2>
          <button
            onClick={onLogout}
            className="px-3 py-1 text-white bg-primary rounded hover:bg-red-700 transition duration-200 text-sm"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col w-full max-w-6xl mx-auto mt-6">
        <div className="w-full p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary">
              AI SmartMap
            </h3>
          </div>
          <AccidentMap onHotspotsNearbyChange={(count) => setNearbyHotspots(count)} /> {/* Pass the nearby count update function */}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
