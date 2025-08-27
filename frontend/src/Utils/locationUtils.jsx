// Utils/locationUtils.js

/**
 * Get current user location using browser's geolocation API
 * @returns {Promise<{lat: number, lng: number}>} Current location coordinates
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        // Fallback to default location (New York City)
        resolve({ lat: 40.7128, lng: -74.0060 });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

/**
 * Reverse geocode coordinates to get formatted address
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<string>} Formatted address
 */
export const reverseGeocode = async (lat, lng) => {
  return new Promise((resolve, reject) => {
    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode(
      { location: { lat, lng } },
      (results, status) => {
        if (status === 'OK' && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          reject(new Error(`Geocoding failed: ${status}`));
        }
      }
    );
  });
};

/**
 * Get current location and convert to address
 * @returns {Promise<{address: string, lat: number, lng: number}>} Location data with address
 */
export const getCurrentLocationWithAddress = async () => {
  try {
    const coordinates = await getCurrentLocation();
    const address = await reverseGeocode(coordinates.lat, coordinates.lng);
    
    return {
      address,
      lat: coordinates.lat,
      lng: coordinates.lng
    };
  } catch (error) {
    console.error('Error getting current location with address:', error);
    throw error;
  }
};

/**
 * Format address to be more concise for display
 * @param {string} fullAddress - Full formatted address
 * @returns {string} Shortened address
 */
export const formatAddressForDisplay = (fullAddress) => {
  if (!fullAddress) return '';
  
  // Split address and take first 2-3 parts for brevity
  const parts = fullAddress.split(',');
  if (parts.length <= 2) return fullAddress;
  
  return parts.slice(0, 2).join(',').trim();
};