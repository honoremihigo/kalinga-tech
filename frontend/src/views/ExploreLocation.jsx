// src/components/ExploreLocation.jsx
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, InfoWindow } from '@react-google-maps/api';
import { MapPin, Search, Loader2 } from 'lucide-react';
import locationService from '../Services/Dispatch/LocationServices';
import useGoogleMaps from '../hooks/useGoogleMaps';

const libraries = ['places', 'marker'];

const ExploreLocation = () => {
  const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API;
  const { loaded: mapsLoaded, error: mapsError } = useGoogleMaps(GOOGLE_MAPS_API_KEY, libraries);

  const [locations, setLocations] = useState([]);
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [mapCenter] = useState({ lat: -1.9441, lng: 30.0619 });
  const [mapZoom] = useState(12);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);
  
  const mapRef = useRef(null);

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    streetViewControl: true,
    mapTypeControl: true,
    fullscreenControl: true,
    mapId: 'DEMO_MAP_ID',
  };

  // Fetch locations
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await locationService.getAllLocations();
        const validLocations = data.filter(
          loc => loc.latitude && loc.longitude && 
          !isNaN(loc.latitude) && !isNaN(loc.longitude)
        );
        setLocations(validLocations);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter locations
  useEffect(() => {
    const filtered = locations.filter(location => 
      location.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLocations(filtered);
  }, [locations, searchTerm]);

  // Update markers when map or filtered locations change
  useEffect(() => {
    if (!mapsLoaded || !map || filteredLocations.length === 0) return;

    const updateMarkers = () => {
      // Clear existing markers
      markers.forEach(marker => {
        if (marker.setMap) marker.setMap(null);
      });

      const newMarkers = filteredLocations.map(location => {
        const position = {
          lat: location.latitude,
          lng: location.longitude
        };

        const marker = new window.google.maps.Marker({
          position,
          map,
          title: location.name,
          icon: {
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0C7.58 0 4 3.58 4 8c0 5.25 8 16 8 16s8-10.75 8-16c0-4.42-3.58-8-8-8zm0 11c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3z" fill="#2563eb"/>
              </svg>
            `),
            scaledSize: new window.google.maps.Size(30, 30),
            anchor: new window.google.maps.Point(15, 30)
          }
        });

        marker.addListener('click', () => {
          setSelectedLocation(location);
        });

        return marker;
      });

      setMarkers(newMarkers);
      fitMapToBounds();
    };

    updateMarkers();
  }, [filteredLocations, map, mapsLoaded]);

  const fitMapToBounds = useCallback(() => {
    if (!map || filteredLocations.length === 0) return;

    const bounds = new window.google.maps.LatLngBounds();
    filteredLocations.forEach(location => {
      bounds.extend({
        lat: location.latitude,
        lng: location.longitude
      });
    });

    map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
  }, [filteredLocations, map]);

  const handleMapLoad = useCallback(mapInstance => {
    setMap(mapInstance);
  }, []);

  const handleInfoWindowClose = useCallback(() => {
    setSelectedLocation(null);
  }, []);

  const toggleFavorite = async (locationId) => {
    try {
      await locationService.toggleFavorite(locationId);
      const updatedLocations = locations.map(loc => 
        loc.id === locationId ? { ...loc, isFavorite: !loc.isFavorite } : loc
      );
      setLocations(updatedLocations);
    } catch (err) {
      setError(err.message);
    }
  };

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <MapPin className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Google Maps API Key Missing
          </h2>
          <p className="text-gray-600">
            Please add VITE_GOOGLE_PLACES_API to your environment variables.
          </p>
        </div>
      </div>
    );
  }

  if (mapsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Error Loading Google Maps
          </h2>
          <p className="text-gray-600 mb-4">{mapsError.message}</p>
        </div>
      </div>
    );
  }

  if (!mapsLoaded || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-red-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">
            {!mapsLoaded ? 'Loading Google Maps...' : 'Loading locations...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-8 h-8 text-red-500" />
                Explore Locations
              </h1>
              <p className="text-gray-600 mt-2">
                Discover {filteredLocations.length} locations on the map
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 w-full sm:w-64"
                />
              </div>

              <button
                onClick={fitMapToBounds}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                disabled={filteredLocations.length === 0}
              >
                Fit to View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-[calc(100vh-180px)] relative">
        <GoogleMap
          mapContainerStyle={{ width: '100%', height: '100%' }}
          center={mapCenter}
          zoom={mapZoom}
          options={mapOptions}
          onLoad={handleMapLoad}
          ref={mapRef}
        >
          {selectedLocation && (
            <InfoWindow
              position={{
                lat: selectedLocation.latitude,
                lng: selectedLocation.longitude,
              }}
              onCloseClick={handleInfoWindowClose}
            >
              <div className="p-3 max-w-xs">
                <h3 className="font-semibold text-gray-900 text-lg mb-2">
                  {selectedLocation.name}
                  <button 
                    onClick={() => toggleFavorite(selectedLocation.id)}
                    className="ml-2 text-yellow-500 hover:text-yellow-600"
                  >
                    {selectedLocation.isFavorite ? '★' : '☆'}
                  </button>
                </h3>
                <p className="text-gray-600 text-sm mb-2">
                  {selectedLocation.address}
                </p>
                <div className="text-xs text-gray-500">
                  <div>Lat: {selectedLocation.latitude.toFixed(6)}</div>
                  <div>Lng: {selectedLocation.longitude.toFixed(6)}</div>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>

        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>{filteredLocations.length} Locations</span>
            </div>
          </div>
        </div>

        {filteredLocations.length === 0 && !loading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-md">
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                No Locations Found
              </h3>
              <p className="text-gray-600">
                {searchTerm ? 'Try adjusting your search' : 'No locations available'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExploreLocation;