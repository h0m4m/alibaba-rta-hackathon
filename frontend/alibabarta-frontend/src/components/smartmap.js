import React, { useEffect, useState } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  DirectionsService,
  DirectionsRenderer,
} from '@react-google-maps/api';

const RADIUS_KM = 2; // Radius in kilometers to consider the point as served by a driver
const ORPHAN_RADIUS_KM = 5; // Radius in kilometers to determine if a busy point is an orphan

const containerStyle = {
  width: '100%',
  height: '500px',
};

const SmartMap = ({ filterSettings, onHotspotsNearbyChange, onHighDemandNearbyChange, navigateToHighDemand }) => {
  const [accidentData, setAccidentData] = useState([]);
  const [busyPoints, setBusyPoints] = useState([]);
  const [taxiStands, setTaxiStands] = useState([]);
  const [userLocation, setUserLocation] = useState({ lat: 25.2819, lng: 55.3678 }); // Simulated location near Al Nahda Pond Park
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);

  // Load Google Maps JavaScript API
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY, // Your Google Maps API Key
  });

  // Fetch accident data from the FastAPI backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/accident-hotspots')
      .then((response) => response.json())
      .then((data) => setAccidentData(data))
      .catch((error) => console.error('Error fetching accident hotspots:', error));
  }, []);

  // Fetch busy points from the FastAPI backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/busy-points')
      .then((response) => response.json())
      .then((data) => setBusyPoints(data))
      .catch((error) => console.error('Error fetching busy points:', error));
  }, []);

  // Fetch taxi stands from the FastAPI backend
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/taxi-stands')
      .then((response) => response.json())
      .then((data) => setTaxiStands(data))
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

  // Mark orphan busy points that do not have a taxi stand within 5 km
  useEffect(() => {
    if (busyPoints.length > 0 && taxiStands.length > 0) {
      const updatedPoints = busyPoints.map((point) => {
        const isOrphan = !taxiStands.some((stand) => {
          const distance = haversineDistance(
            { lat: point.start_lat, lng: point.start_lon },
            { lat: stand.location_latitude, lng: stand.location_longitude }
          );
          return distance <= ORPHAN_RADIUS_KM;
        });
        return { ...point, isOrphan };
      });

      setBusyPoints((prevPoints) => {
        if (JSON.stringify(prevPoints) !== JSON.stringify(updatedPoints)) {
          return updatedPoints; // Only update state if there's an actual change
        }
        return prevPoints; // Prevent unnecessary updates
      });
    }
  }, [taxiStands]);

  // Check if any accident hotspots are nearby
  useEffect(() => {
    if (userLocation && accidentData.length > 0) {
      const nearbyHotspots = accidentData.some((hotspot) => {
        const distance = haversineDistance(userLocation, {
          lat: hotspot.acci_x,
          lng: hotspot.acci_y,
        });
        return distance <= RADIUS_KM;
      });

      onHotspotsNearbyChange(nearbyHotspots);
    }
  }, [userLocation, accidentData, onHotspotsNearbyChange]);

  // Check if any high-demand areas are nearby
  useEffect(() => {
    if (userLocation && busyPoints.length > 0) {
      let closestPoint = null;
      let minDistance = Infinity;

      busyPoints.forEach((point) => {
        const distance = haversineDistance(userLocation, {
          lat: point.start_lat,
          lng: point.start_lon,
        });

        if (distance <= RADIUS_KM && distance < minDistance) {
          closestPoint = point;
          minDistance = distance;
        }
      });

      onHighDemandNearbyChange(closestPoint);
    }
  }, [userLocation, busyPoints, onHighDemandNearbyChange]);

  // Handle navigation to high-demand point
  useEffect(() => {
    if (navigateToHighDemand) {
      setDirectionsResponse({
        origin: userLocation,
        destination: { lat: navigateToHighDemand.start_lat, lng: navigateToHighDemand.start_lon },
        travelMode: 'DRIVING',
      });
    }
  }, [navigateToHighDemand, userLocation]);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={userLocation || { lat: 25.3463, lng: 55.4209 }}
      zoom={12}
    >
      {/* User Location Marker */}
      {userLocation && (
        <Marker
          position={userLocation}
          icon={{
            url: '/icons/user-location.png',
            scaledSize: new window.google.maps.Size(45, 45),
          }}
          onClick={() => setSelectedLocation({ type: 'user' })}
        />
      )}

      {/* Accident Hotspots */}
      {filterSettings.showAccidentHotspots &&
        accidentData.map((hotspot, index) => (
          <Marker
            key={`accident-${index}`}
            position={{ lat: hotspot.acci_x, lng: hotspot.acci_y }}
            icon={{
              url: '/icons/accidentmarker.png',
              scaledSize: new window.google.maps.Size(41, 41),
            }}
            onClick={() => setSelectedLocation({ type: 'accident', data: hotspot })}
          />
        ))}

      {/* Busy Points */}
      {filterSettings.showBusyPoints &&
        busyPoints.map((point, index) => (
          <Marker
            key={`busy-${index}`}
            position={{ lat: point.start_lat, lng: point.start_lon }}
            icon={{
              url: point.isOrphan ? '/icons/purplebusypointmarker.png' : '/icons/busypointmarker.png',
              scaledSize: new window.google.maps.Size(41, 41),
            }}
            onClick={() =>
              setDirectionsResponse({
                origin: userLocation,
                destination: { lat: point.start_lat, lng: point.start_lon },
                travelMode: 'DRIVING',
              })
            }
          />
        ))}

      {/* Taxi Stands */}
      {filterSettings.showTaxiStands &&
        taxiStands.map((stand, index) => (
          <Marker
            key={`taxi-${index}`}
            position={{ lat: stand.location_latitude, lng: stand.location_longitude }}
            icon={{
              url: '/icons/taxistand.png',
              scaledSize: new window.google.maps.Size(41, 41),
            }}
            onClick={() =>
              setDirectionsResponse({
                origin: userLocation,
                destination: { lat: stand.location_latitude, lng: stand.location_longitude },
                travelMode: 'DRIVING',
              })
            }
          />
        ))}

      {/* Render Directions */}
      {directionsResponse && (
        <DirectionsService
          options={directionsResponse}
          callback={(response) => {
            if (response !== null) {
              setDirectionsResponse(response);
            } else {
              console.error('Directions request failed');
            }
          }}
        />
      )}

      {directionsResponse && (
        <DirectionsRenderer
          options={{
            directions: directionsResponse,
          }}
        />
      )}
    </GoogleMap>
  ) : (
    <></>
  );
};

export default SmartMap;
