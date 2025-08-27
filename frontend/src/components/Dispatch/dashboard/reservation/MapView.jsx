import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GoogleMap, DirectionsRenderer } from '@react-google-maps/api';

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
};

// Default center (Kigali, Rwanda)
const defaultCenter = {
  lat: -1.9441,
  lng: 30.0619,
};

const MapView = ({ pickupAddress, dropoffAddress, onDistanceCalculated }) => {
  const [directions, setDirections] = useState(null);
  const [map, setMap] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const directionsService = useRef(null);
  const directionsRenderer = useRef(null); // 🔥 KEY FIX: Store renderer reference
  const lastRequestRef = useRef('');

  // Debounce utility to limit rapid API calls
  const debounce = useCallback((func, wait) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), wait);
    };
  }, []);

  // 🔥 KEY FIX: Function to completely clear the renderer
  const clearDirectionsRenderer = useCallback(() => {
    if (directionsRenderer.current) {
      // Completely remove the renderer from the map
      directionsRenderer.current.setMap(null);
      directionsRenderer.current = null;
    }
    setDirections(null);
    onDistanceCalculated(null, null);
  }, [onDistanceCalculated]);

  // 🔥 KEY FIX: Function to create fresh renderer
  const createDirectionsRenderer = useCallback(() => {
    if (map && !directionsRenderer.current) {
      directionsRenderer.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: false,
        preserveViewport: false,
        polylineOptions: {
          strokeColor: '#000',
          strokeWeight: 5,
          strokeOpacity: 0.8,
        },
      });
      directionsRenderer.current.setMap(map);
    }
  }, [map]);

  // Memoized function to calculate directions
  const calculateDirections = useCallback(
    async (force = false) => {
      if (!map || !pickupAddress || !dropoffAddress) return;

      const requestId = `${pickupAddress}-${dropoffAddress}`;

      // Prevent duplicate requests unless forced
      if (!force && (lastRequestRef.current === requestId || isLoading)) {
        return;
      }

      lastRequestRef.current = requestId;
      setIsLoading(true);

      try {
        // 🔥 KEY FIX: Completely clear old renderer
        clearDirectionsRenderer();
        
        // 🔥 KEY FIX: Wait for clearing to complete
        await new Promise((res) => setTimeout(res, 100));
        
        // 🔥 KEY FIX: Create fresh renderer
        createDirectionsRenderer();

        if (!directionsService.current) {
          directionsService.current = new window.google.maps.DirectionsService();
        }

        const request = {
          origin: pickupAddress,
          destination: dropoffAddress,
          travelMode: window.google.maps.TravelMode.DRIVING,
          unitSystem: window.google.maps.UnitSystem.METRIC,
        };

        directionsService.current.route(request, (result, status) => {
          setIsLoading(false);
          if (status === window.google.maps.DirectionsStatus.OK && result) {
            console.log('New directions calculated:', result);
            
            // 🔥 KEY FIX: Set directions to fresh renderer
            if (directionsRenderer.current) {
              directionsRenderer.current.setDirections(result);
            }
            setDirections(result);
            
            const leg = result.routes[0]?.legs[0];
            if (leg) {
              onDistanceCalculated(leg.distance?.text ?? null, leg.duration?.text ?? null);
            }
          } else {
            console.error('Directions request failed:', status);
            clearDirectionsRenderer();
          }
        });
      } catch (error) {
        console.error('Error calculating directions:', error);
        setIsLoading(false);
        clearDirectionsRenderer();
      }
    },
    [map, pickupAddress, dropoffAddress, onDistanceCalculated, isLoading, clearDirectionsRenderer, createDirectionsRenderer]
  );

  // Debounced calculateDirections
  const debouncedCalculateDirections = useCallback(debounce(calculateDirections, 500), [
    calculateDirections,
  ]);

  // Effect to clear directions and trigger recalculation when addresses change
  useEffect(() => {
    if (!pickupAddress || !dropoffAddress) {
      clearDirectionsRenderer();
      lastRequestRef.current = '';
      return;
    }

    const requestId = `${pickupAddress}-${dropoffAddress}`;
    if (lastRequestRef.current !== requestId) {
      console.log('Address changed, clearing old routes');
      
      // 🔥 KEY FIX: Clear completely before calculating new route
      clearDirectionsRenderer();
      
      // 🔥 KEY FIX: Force recalculation with fresh renderer
      setTimeout(() => {
        debouncedCalculateDirections(true);
      }, 150);
    }
  }, [pickupAddress, dropoffAddress, clearDirectionsRenderer, debouncedCalculateDirections]);

  // Effect for initial calculation when map loads
  useEffect(() => {
    if (map && pickupAddress && dropoffAddress && !directions) {
      debouncedCalculateDirections();
    }
  }, [map, pickupAddress, dropoffAddress, directions, debouncedCalculateDirections]);

  const onLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    clearDirectionsRenderer();
    setMap(null);
    lastRequestRef.current = '';
  }, [clearDirectionsRenderer]);

  return (
    <div className="w-full h-[80vh] rounded-lg overflow-hidden border border-gray-300 relative">
      {isLoading && (
        <div className="absolute top-2 left-2 z-10 bg-white px-3 py-1 rounded-full shadow-md">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            <span className="text-sm text-gray-600">Calculating route...</span>
          </div>
        </div>
      )}
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={defaultCenter}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          gestureHandling: 'cooperative',
        }}
      >
        {/* 🔥 REMOVED: Don't use React's DirectionsRenderer - we manage it manually */}
      </GoogleMap>
    </div>
  );
};

export default MapView;