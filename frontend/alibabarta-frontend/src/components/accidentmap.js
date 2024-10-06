// AccidentMap.js
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';

const RADIUS_KM = 2; // Define the radius in kilometers within which to consider a hotspot as 'close'

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
  const [userLocation, setUserLocation] = useState(null);

  // Fetch accident data from the FastAPI backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/accident-hotspots')
      .then((response) => response.json())
      .then((data) => setAccidentData(data));
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

  // Update user location and count hotspots nearby
  useEffect(() => {
    if (userLocation && accidentData.length > 0) {
      const nearbyCount = accidentData.filter((hotspot) => {
        const distance = haversineDistance(userLocation, {
          lat: hotspot.lat,
          lng: hotspot.lng,
        });
        return distance <= RADIUS_KM;
      }).length;

      onHotspotsNearbyChange(nearbyCount);
    }
  }, [userLocation, accidentData, onHotspotsNearbyChange]);

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
            iconSize: [25, 25],
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
          position={[hotspot.lat, hotspot.lng]}
          icon={L.icon({
            iconUrl: hotspot.intensity > 5 ? `${process.env.PUBLIC_URL}/icons/redmarker.png` : `${process.env.PUBLIC_URL}/icons/yellowmarker.png`,
            iconSize: [35, 35],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
          })}
        >
          <Popup>
            <div>
              <p><strong>Intensity:</strong> {hotspot.intensity}</p>
              <p>{hotspot.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default AccidentMap;
