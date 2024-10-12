// DashboardPage.js
import React, { useState } from 'react';
import SmartMap from '../components/smartmap'; // Import the SmartMap component

const DashboardPage = ({ user, onLogout }) => {
  const [nearbyHotspots, setNearbyHotspots] = useState(false); // Boolean to track if there are nearby hotspots
  const [filterSettings, setFilterSettings] = useState({
    showAccidentHotspots: true,
    showBusyPoints: true,
    showTaxiStands: true,
  });

  const [showModal, setShowModal] = useState(false);

  const handleFilterChange = (e) => {
    const { name, checked } = e.target;
    setFilterSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

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
        <button
          onClick={() => setShowModal(true)}
          className="px-3 py-1 text-white bg-primary rounded hover:bg-blue-700 transition duration-200 text-sm"
        >
          Filter
        </button>
      </div>

      {/* Main Content Section */}
      <div className="flex flex-col w-full max-w-6xl mx-auto mt-6">
        {/* Accident Hotspot Notification Container */}
        <div
          className={`w-full p-4 rounded-lg shadow-md mb-6 ${
            nearbyHotspots ? 'bg-red-500' : 'bg-green-500'
          }`}
        >
          <h3 className="text-xl font-bold text-white">Accident Hotspots</h3>
          <p className="text-white">
            {nearbyHotspots
              ? 'Accident Hotspot Nearby, Be Careful!'
              : 'No Accident Hotspots Nearby!'}
          </p>
        </div>

        <div className="w-full p-6 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-primary">AI SmartMap</h3>
          </div>
          <SmartMap
            filterSettings={filterSettings}
            onHotspotsNearbyChange={(isNearby) => setNearbyHotspots(isNearby)} // Pass the nearby status update function
          />
        </div>
      </div>

      {/* Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Filter Map Markers</h3>
            <div className="mb-4">
              <label>
                <input
                  type="checkbox"
                  name="showAccidentHotspots"
                  checked={filterSettings.showAccidentHotspots}
                  onChange={handleFilterChange}
                />
                Accident Hotspots
              </label>
            </div>
            <div className="mb-4">
              <label>
                <input
                  type="checkbox"
                  name="showBusyPoints"
                  checked={filterSettings.showBusyPoints}
                  onChange={handleFilterChange}
                />
                Busy Points
              </label>
            </div>
            <div className="mb-4">
              <label>
                <input
                  type="checkbox"
                  name="showTaxiStands"
                  checked={filterSettings.showTaxiStands}
                  onChange={handleFilterChange}
                />
                Taxi Stands
              </label>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-1 text-white bg-primary rounded hover:bg-blue-700 transition duration-200 text-sm"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
