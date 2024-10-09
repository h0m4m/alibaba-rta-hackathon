import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const RADIUS_KM = 2; // Define the radius in kilometers to consider the point as served by a driver

const LocateUser = ({ onLocationUpdate }) => {
  const map = useMap();

  useEffect(() => {
    const updateLocation = (position) => {
      const { latitude, longitude } = position.coords;
      onLocationUpdate(latitude, longitude);
      map.setView([latitude, longitude], 13);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(updateLocation);
      navigator.geolocation.watchPosition(updateLocation);
    }
  }, [map, onLocationUpdate]);

  return null;
};

const AccidentMap = ({ onHotspotsNearbyChange }) => {
  const [accidentData, setAccidentData] = useState([]);
  const [busyPoints, setBusyPoints] = useState([]);
  const [taxiStands, setTaxiStands] = useState([]);
  const [userLocation, setUserLocation] = useState(null);

  // Fetch accident data from the FastAPI backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/accident-hotspots')
      .then((response) => response.json())
      .then((data) => {
        setAccidentData(data);
        console.log("Accident data:", data);
      })
      .catch((error) => console.error('Error fetching accident hotspots:', error));
  }, []);

  // Fetch busy points from the FastAPI backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/busy-points')
      .then((response) => response.json())
      .then((data) => {
        setBusyPoints(data);
        console.log("Busy points fetched:", data);
      })
      .catch((error) => console.error('Error fetching busy points:', error));
  }, []);

  // Fetch taxi stands from the FastAPI backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/taxi-stands')
      .then((response) => response.json())
      .then((data) => {
        setTaxiStands(data);
        console.log("Taxi stands fetched:", data);
      })
      .catch((error) => console.error('Error fetching taxi stands:', error));
  }, []);

  // Function to calculate distance between two coordinates using Haversine formula
  const haversineDistance = (coords1, coords2) => {
    const toRad = (x) => (x * Math.PI) / 180;

    const R = 6371; // Earth's radius in kilometers
    const dLat = toRad(coords2.lat - coords1.lat);
    const dLon = toRad(coords2.lng - coords1.lng);

    const lat1 = toRad(coords1.lat);
    const lat2 = toRad(coords2.lat);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in kilometers
  };

  return (
    <MapContainer center={[25.3463, 55.4209]} zoom={12} style={{ height: '500px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <LocateUser onLocationUpdate={(lat, lng) => setUserLocation({ lat, lng })} />

      {/* Display User Location Marker */}
      {userLocation && (
        <Marker
          position={[userLocation.lat, userLocation.lng]}
          icon={L.icon({
            iconUrl: require('leaflet/dist/images/marker-icon.png'),
            iconSize: [30, 45],
            iconAnchor: [15, 45],
            popupAnchor: [0, -40],
          })}
        >
          <Popup>You are here</Popup>
        </Marker>
      )}

      {/* Display Accident Hotspots */}
      {accidentData.map((hotspot, index) => (
        <Marker
          key={index}
          position={[hotspot.acci_x, hotspot.acci_y]}
          icon={L.icon({
            iconUrl: `${process.env.PUBLIC_URL}/icons/accidentmarker.png`,
            iconSize: [41, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })}
        >
          <Popup>
            <div>
              <p><strong>Accident Hotspot</strong></p>
              <p>Hour: {hotspot.hour}:00 - {hotspot.hour + 1}:00</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Display Busy Points */}
      {busyPoints.map((point, index) => (
        <Marker
          key={index}
          position={[point.start_lat, point.start_lon]}
          icon={L.icon({
            iconUrl: `${process.env.PUBLIC_URL}/icons/busypointmarker.png`,
            iconSize: [41, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })}
        >
          <Popup>
            <div>
              <p><strong>Busy Point</strong></p>
              <p>Weekday: {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][point.weekday - 1]}</p>
              <p>Hour: {point.hour}:00 - {point.hour + 1}:00</p>
            </div>
          </Popup>
        </Marker>
      ))}

      {/* Display Taxi Stands */}
      {taxiStands.map((stand, index) => (
        <Marker
          key={index}
          position={[stand.location_latitude, stand.location_longitude]}
          icon={L.icon({
            iconUrl: `${process.env.PUBLIC_URL}/icons/taxistand.png`,
            iconSize: [41, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })}
        >
          <Popup>
            <div>
              <p><strong>Taxi Stand</strong></p>
              <p>Location: {stand.location_name}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AccidentMap;