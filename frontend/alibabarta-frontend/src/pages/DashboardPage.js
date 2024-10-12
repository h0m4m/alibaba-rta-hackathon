import React, { useState } from 'react';
import SmartMap from '../components/smartmap'; // Import the SmartMap component

const DashboardPage = ({ user, onLogout }) => {
  const [nearbyHotspots, setNearbyHotspots] = useState(false);
  const [highDemandPoint, setHighDemandPoint] = useState(null);
  const [navigateToHighDemand, setNavigateToHighDemand] = useState(null);
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

  const handleNavigateToHighDemand = () => {
    if (highDemandPoint) {
      setNavigateToHighDemand(highDemandPoint); // Set navigation target to the closest high-demand point
    }
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

      {/* Notification Section */}
      <div className="flex flex-row w-full max-w-6xl mx-auto mt-6 space-x-4">
        <div className="w-1/2 p-4 rounded-lg shadow-md" style={{ backgroundColor: nearbyHotspots ? '#ffcccc' : '#ccffcc' }}>
          <h3 className="text-lg font-bold">Accident Hotspots</h3>
          <p>{nearbyHotspots ? 'Accident Hotspot Nearby, Be Careful!' : 'No Accident Hotspots Nearby!'}</p>
        </div>

        <div className="w-1/2 p-4 rounded-lg shadow-md" style={{ backgroundColor: highDemandPoint ? '#ffeb99' : '#e0e0e0' }}>
          <h3 className="text-lg font-bold">High Demand Area</h3>
          <div className="flex items-center justify-between">
            <p>{highDemandPoint ? 'High Demand Area Nearby!' : 'No High Demand Area Nearby!'}</p>
            {highDemandPoint && (
              <button
                onClick={handleNavigateToHighDemand}
                className="px-5 py-1 text-white bg-blue-600 rounded hover:bg-blue-700 transition duration-200 text-sm"
              >
                Go
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="w-full max-w-6xl mx-auto mt-6">
        <SmartMap
          filterSettings={filterSettings}
          onHotspotsNearbyChange={(nearby) => setNearbyHotspots(nearby)}
          onHighDemandNearbyChange={(point) => setHighDemandPoint(point)}
          navigateToHighDemand={navigateToHighDemand} // Pass the point to navigate to
        />
      </div>

      {/* Filter Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4">Filter Map Markers</h3>
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showAccidentHotspots"
                  checked={filterSettings.showAccidentHotspots}
                  onChange={handleFilterChange}
                  className="form-checkbox"
                />
                <span>Accident Hotspots</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showBusyPoints"
                  checked={filterSettings.showBusyPoints}
                  onChange={handleFilterChange}
                  className="form-checkbox"
                />
                <span>Busy Points</span>
              </label>
            </div>
            <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  name="showTaxiStands"
                  checked={filterSettings.showTaxiStands}
                  onChange={handleFilterChange}
                  className="form-checkbox"
                />
                <span>Taxi Stands</span>
              </label>
            </div>
            <button
              onClick={() => setShowModal(false)}
              className="px-3 py-1 text-white bg-primary rounded hover:bg-blue-700 transition duration-200 text-sm w-full mt-4"
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