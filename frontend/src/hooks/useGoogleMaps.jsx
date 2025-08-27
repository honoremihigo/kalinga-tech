// src/hooks/useGoogleMaps.js
import { useEffect, useState } from 'react';

const useGoogleMaps = (apiKey, libraries = []) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if Google Maps API is already loaded
    if (window.google && window.google.maps) {
      setLoaded(true);
      return;
    }

    // Check if script is already added
    const existingScript = document.querySelector(
      `script[src^="https://maps.googleapis.com/maps/api/js"]`
    );

    if (existingScript) {
      // If script exists but not loaded yet, wait for it
      const onScriptLoad = () => setLoaded(true);
      const onScriptError = () => setError(new Error('Failed to load Google Maps'));
      
      existingScript.addEventListener('load', onScriptLoad);
      existingScript.addEventListener('error', onScriptError);

      return () => {
        existingScript.removeEventListener('load', onScriptLoad);
        existingScript.removeEventListener('error', onScriptError);
      };
    }

    // Load the script if not already present
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setLoaded(true);
    };
    
    script.onerror = () => {
      setError(new Error('Failed to load Google Maps'));
    };

    document.head.appendChild(script);

    return () => {
      // Don't remove the script as it's needed globally
      // Just clean up event listeners if any
    };
  }, [apiKey, libraries]);

  return { loaded, error };
};

export default useGoogleMaps;