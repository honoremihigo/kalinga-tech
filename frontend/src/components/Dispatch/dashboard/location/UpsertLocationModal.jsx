import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, MapPin, Navigation, Globe, Calendar, AlertTriangle, User, Hash, Search, Heart } from 'lucide-react';
import { GoogleMap, LoadScript, Marker, Autocomplete, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
  width: '100%',
  height: '300px'
};

const defaultCenter = {
  lat: -1.9441, // Kigali, Rwanda
  lng: 30.0619
};

// Enhanced Upsert Location Modal Component with Google Maps and Favorites
const UpsertLocationModal = ({ isOpen, onClose, onSubmit, location, isLoading, title }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: '',
    longitude: '',
    is_favorite: false
  });
  const [errors, setErrors] = useState({});
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [isMapLoaded, setIsMapLoaded] = useState(false);
  
  const autocompleteRef = useRef(null);
  const mapRef = useRef(null);

  const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API;

  // Use useJsApiLoader instead of LoadScript to avoid multiple loading
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: API_KEY,
    libraries: libraries
  });

  useEffect(() => {
    if (location) {
      const locationData = {
        name: location.name || '',
        address: location.address || '',
        latitude: location.latitude?.toString() || '',
        longitude: location.longitude?.toString() || '',
        is_favorite: location.is_favorite || false
      };
      setFormData(locationData);
      
      // Set map center and marker for existing location
      if (location.latitude && location.longitude) {
        const position = { lat: location.latitude, lng: location.longitude };
        setMapCenter(position);
        setMarkerPosition(position);
      }
    } else {
      setFormData({
        name: '',
        address: '',
        latitude: '',
        longitude: '',
        is_favorite: false
      });
      setMapCenter(defaultCenter);
      setMarkerPosition(null);
    }
    setErrors({});
  }, [location, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Location name is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    
    // Validate latitude
    const lat = parseFloat(formData.latitude);
    if (!formData.latitude || isNaN(lat)) {
      newErrors.latitude = 'Valid latitude is required';
    } else if (lat < -90 || lat > 90) {
      newErrors.latitude = 'Latitude must be between -90 and 90';
    }

    // Validate longitude
    const lng = parseFloat(formData.longitude);
    if (!formData.longitude || isNaN(lng)) {
      newErrors.longitude = 'Valid longitude is required';
    } else if (lng < -180 || lng > 180) {
      newErrors.longitude = 'Longitude must be between -180 and 180';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const submissionData = {
        name: formData.name.trim(),
        address: formData.address.trim(),
        latitude: parseFloat(formData.latitude),
        longitude: parseFloat(formData.longitude),
        is_favorite: formData.is_favorite
      };
      onSubmit(submissionData);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleFavoriteToggle = () => {
    setFormData(prev => ({ ...prev, is_favorite: !prev.is_favorite }));
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords = {
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString()
          };
          
          setFormData(prev => ({
            ...prev,
            latitude: coords.latitude,
            longitude: coords.longitude
          }));

          const mapPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setMapCenter(mapPosition);
          setMarkerPosition(mapPosition);

          // Clear any existing coordinate errors
          setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.latitude;
            delete newErrors.longitude;
            return newErrors;
          });

          // Reverse geocoding to get address and name
          if (isLoaded && window.google && window.google.maps) {
            try {
              const geocoder = new window.google.maps.Geocoder();
              geocoder.geocode({ location: mapPosition }, (results, status) => {
                if (status === 'OK' && results[0]) {
                  const result = results[0];
                  
                  // Extract meaningful location name from address components
                  let locationName = 'Current Location';
                  
                  // Try to find a good name from address components
                  if (result.address_components) {
                    const components = result.address_components;
                    
                    // Priority order for location naming
                    const nameTypes = [
                      'establishment', 
                      'point_of_interest',
                      'premise',
                      'subpremise',
                      'neighborhood',
                      'sublocality_level_1',
                      'sublocality',
                      'locality',
                      'administrative_area_level_2',
                      'administrative_area_level_1'
                    ];
                    
                    for (const type of nameTypes) {
                      const component = components.find(comp => comp.types.includes(type));
                      if (component) {
                        locationName = component.long_name;
                        break;
                      }
                    }
                  }
                  
                  // If still generic, try to use a more specific part of the formatted address
                  if (locationName === 'Current Location' && result.formatted_address) {
                    const addressParts = result.formatted_address.split(',');
                    if (addressParts.length > 0) {
                      locationName = addressParts[0].trim() || 'Current Location';
                    }
                  }
                  
                  setFormData(prev => ({
                    ...prev,
                    address: result.formatted_address,
                    name: prev.name || locationName // Only update if name is empty
                  }));
                }
              });
            } catch (error) {
              console.warn('Geocoding failed:', error);
              // Fallback name when geocoding fails
              setFormData(prev => ({
                ...prev,
                name: prev.name || 'Current Location'
              }));
            }
          } else {
            // Fallback when Google Maps is not available
            setFormData(prev => ({
              ...prev,
              name: prev.name || 'Current Location'
            }));
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your current location. Please enter coordinates manually.');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const onPlaceSelected = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry && place.geometry.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        setFormData(prev => ({
          ...prev,
          name: place.name || prev.name,
          address: place.formatted_address || place.vicinity || '',
          latitude: lat.toString(),
          longitude: lng.toString()
        }));

        const position = { lat, lng };
        setMapCenter(position);
        setMarkerPosition(position);

        // Clear errors
        setErrors({});
      }
    }
  }, []);

  const onMapClick = useCallback((event) => {
    if (!isLoaded || !window.google) return;
    
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    
    setFormData(prev => ({
      ...prev,
      latitude: lat.toString(),
      longitude: lng.toString()
    }));

    const position = { lat, lng };
    setMarkerPosition(position);

    // Reverse geocoding to get address and set name
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: position }, (results, status) => {
        if (status === 'OK' && results[0]) {
          const result = results[0];
          
          // Extract meaningful location name from address components
          let locationName = 'Selected Location';
          
          if (result.address_components) {
            const components = result.address_components;
            
            // Priority order for location naming
            const nameTypes = [
              'establishment', 
              'point_of_interest',
              'premise',
              'subpremise',
              'neighborhood',
              'sublocality_level_1',
              'sublocality',
              'locality',
              'administrative_area_level_2'
            ];
            
            for (const type of nameTypes) {
              const component = components.find(comp => comp.types.includes(type));
              if (component) {
                locationName = component.long_name;
                break;
              }
            }
          }
          
          // If still generic, use first part of formatted address
          if (locationName === 'Selected Location' && result.formatted_address) {
            const addressParts = result.formatted_address.split(',');
            if (addressParts.length > 0) {
              locationName = addressParts[0].trim() || 'Selected Location';
            }
          }
          
          setFormData(prev => ({
            ...prev,
            address: result.formatted_address,
            name: prev.name || locationName // Only update name if it's empty
          }));
        }
      });
    } catch (error) {
      console.warn('Geocoding failed:', error);
    }

    // Clear coordinate errors
    setErrors(prev => {
      const newErrors = { ...prev };
      delete newErrors.latitude;
      delete newErrors.longitude;
      return newErrors;
    });
  }, [isLoaded]);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
    setIsMapLoaded(true);
  }, []);

  // Update marker position when coordinates change manually
  useEffect(() => {
    const lat = parseFloat(formData.latitude);
    const lng = parseFloat(formData.longitude);
    
    if (!isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
      const position = { lat, lng };
      setMarkerPosition(position);
      setMapCenter(position);
    }
  }, [formData.latitude, formData.longitude]);

  if (!isOpen) return null;

  if (loadError) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertTriangle size={24} />
            <h3 className="text-lg font-semibold">Maps Loading Error</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Failed to load Google Maps. Please check your internet connection and API key.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!API_KEY) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertTriangle size={24} />
            <h3 className="text-lg font-semibold">Configuration Error</h3>
          </div>
          <p className="text-gray-700 mb-4">
            Google Places API key is not configured. Please add VITE_GOOGLE_PLACES_API to your environment variables.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-6 max-w-md">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading Maps...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
              {/* Favorite indicator for existing locations */}
              {location && formData.is_favorite && (
                <Heart size={20} className="text-red-500 fill-current" />
              )}
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Location Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Search Location
              </label>
              {isLoaded && window.google ? (
                <>
                  <Autocomplete
                    onLoad={(autocomplete) => {
                      autocompleteRef.current = autocomplete;
                    }}
                    onPlaceChanged={onPlaceSelected}
                    options={{
                      fields: ['name', 'formatted_address', 'geometry', 'vicinity'],
                      // componentRestrictions: { country: 'rw' } // Restrict to Rwanda
                    }}
                  >
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                      <input
                        type="text"
                        className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        placeholder="Search for places in Rwanda..."
                      />
                    </div>
                  </Autocomplete>

                  {/* Map Preview */}
                  <div className="mt-4 border border-gray-300 rounded-lg overflow-hidden">
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={mapCenter}
                      zoom={markerPosition ? 15 : 10}
                      onClick={onMapClick}
                      onLoad={onMapLoad}
                      options={{
                        streetViewControl: false,
                        mapTypeControl: false,
                        fullscreenControl: false
                      }}
                    >
                      {markerPosition && (
                        <Marker
                          position={markerPosition}
                          draggable={true}
                          onDragEnd={(event) => {
                            if (!window.google) return;
                            
                            const lat = event.latLng.lat();
                            const lng = event.latLng.lng();
                            
                            setFormData(prev => ({
                              ...prev,
                              latitude: lat.toString(),
                              longitude: lng.toString()
                            }));

                            // Reverse geocoding with smart naming
                            try {
                              const geocoder = new window.google.maps.Geocoder();
                              geocoder.geocode({ location: { lat, lng } }, (results, status) => {
                                if (status === 'OK' && results[0]) {
                                  const result = results[0];
                                  
                                  // Extract meaningful location name
                                  let locationName = 'Dragged Location';
                                  
                                  if (result.address_components) {
                                    const components = result.address_components;
                                    const nameTypes = [
                                      'establishment', 
                                      'point_of_interest',
                                      'premise',
                                      'neighborhood',
                                      'sublocality_level_1',
                                      'locality'
                                    ];
                                    
                                    for (const type of nameTypes) {
                                      const component = components.find(comp => comp.types.includes(type));
                                      if (component) {
                                        locationName = component.long_name;
                                        break;
                                      }
                                    }
                                  }
                                  
                                  // Fallback to first part of address
                                  if (locationName === 'Dragged Location' && result.formatted_address) {
                                    const addressParts = result.formatted_address.split(',');
                                    if (addressParts.length > 0) {
                                      locationName = addressParts[0].trim() || 'Dragged Location';
                                    }
                                  }
                                  
                                  setFormData(prev => ({
                                    ...prev,
                                    address: result.formatted_address,
                                    name: prev.name || locationName // Only update if name is empty
                                  }));
                                }
                              });
                            } catch (error) {
                              console.warn('Geocoding failed:', error);
                            }
                          }}
                        />
                      )}
                    </GoogleMap>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">
                    Click on the map or drag the marker to set location
                  </p>
                </>
              ) : (
                <div className="mt-4 border border-gray-300 rounded-lg p-8 flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading map...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Location Name and Favorite Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Enter location name"
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Favorite
                </label>
                <button
                  type="button"
                  onClick={handleFavoriteToggle}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 border rounded-lg transition-colors ${
                    formData.is_favorite 
                      ? 'border-red-300 bg-red-50 text-red-700' 
                      : 'border-gray-300 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Heart 
                    size={16} 
                    className={formData.is_favorite ? 'fill-current' : ''} 
                  />
                  {formData.is_favorite ? 'Favorite' : 'Add to Favorites'}
                </button>
              </div>
            </div>

            {/* Address */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                value={formData.address}
                onChange={(e) => handleChange('address', e.target.value)}
                rows={3}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none ${
                  errors.address ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Enter full address"
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>

            {/* Coordinates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Latitude *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.latitude}
                  onChange={(e) => handleChange('latitude', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.latitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="-1.9441"
                />
                {errors.latitude && <p className="text-red-500 text-xs mt-1">{errors.latitude}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Longitude *
                </label>
                <input
                  type="number"
                  step="any"
                  value={formData.longitude}
                  onChange={(e) => handleChange('longitude', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.longitude ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="30.0619"
                />
                {errors.longitude && <p className="text-red-500 text-xs mt-1">{errors.longitude}</p>}
              </div>
            </div>

            {/* Current Location Button */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              <button
                type="button"
                onClick={getCurrentLocation}
                className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg font-medium transition-colors"
              >
                <Navigation size={16} />
                Use Current Location
              </button>
              <p className="text-sm text-gray-500">
                Click to automatically fill coordinates with your current location
              </p>
            </div>

            {/* Guidelines */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">How to use:</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Search for a place using the search box above</li>
                <li>• Click anywhere on the map to set a location</li>
                <li>• Drag the marker to fine-tune the position</li>
                <li>• Use "Current Location" to auto-fill your position</li>
                <li>• Mark as favorite for quick access</li>
                <li>• Manually enter coordinates if needed</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Saving...' : (location ? 'Update' : 'Add')} Location
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpsertLocationModal;