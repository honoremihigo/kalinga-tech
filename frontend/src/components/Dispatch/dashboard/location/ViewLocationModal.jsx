import React, { useState, useEffect, useCallback } from 'react';
import { X, MapPin, Navigation, Globe, Calendar, AlertTriangle, User, Hash } from 'lucide-react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const libraries = ['places'];
const mapContainerStyle = {
    width: '100%',
    height: '400px'
};

// View Location Modal Component with Google Maps
const ViewLocationModal = ({ isOpen, onClose, location }) => {
    const [mapCenter, setMapCenter] = useState({ lat: -1.9441, lng: 30.0619 });
    const [mapLoaded, setMapLoaded] = useState(false);
    const [isCopied, setIsCopied] = useState(false);

    const API_KEY = import.meta.env.VITE_GOOGLE_PLACES_API;

    // Use useJsApiLoader for Google Maps
    const { isLoaded, loadError } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: API_KEY,
        libraries: libraries
    });

    // Update map center when location changes
    useEffect(() => {
        if (location && location.latitude && location.longitude) {
            setMapCenter({
                lat: location.latitude,
                lng: location.longitude
            });
        }
    }, [location]);

    const onMapLoad = useCallback((map) => {
        setMapLoaded(true);
    }, []);

    if (!isOpen || !location) return null;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCoordinates = (lat, lng) => {
        return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    };

    const openInGoogleMaps = () => {
        const url = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
        window.open(url, '_blank');
    };

    const openInOpenStreetMap = () => {
        const url = `https://www.openstreetmap.org/?mlat=${location.latitude}&mlon=${location.longitude}&zoom=15`;
        window.open(url, '_blank');
    };

    const copyCoordinates = () => {
        const coords = `${location.latitude}, ${location.longitude}`;
        navigator.clipboard.writeText(coords).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
        });
    };

    // Error handling for missing API key
    if (!API_KEY) {
        console.warn('Google Maps API key not found. Map preview will not be available.');
    }

    // Create a simpler marker icon
    const createMarkerIcon = () => {
        if (!isLoaded || !window.google) return null;
        
        return {
            path: window.google.maps.SymbolPath.BACKWARD_CLOSED_ARROW,
            scale: 6,
            fillColor: '#EF4444',
            fillOpacity: 1,
            strokeWeight: 2,
            strokeColor: '#DC2626',
            anchor: new window.google.maps.Point(0, 6)
        };
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between sticky top-0 left-0 z-50 p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-blue-100">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Location Details</h2>
                            <p className="text-blue-600 font-medium">
                                {location.name || 'Unknown Location'}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                    >
                        <X size={24} className="text-gray-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {/* Full Width Map Section */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-5 h-5 text-blue-600" />
                            <h3 className="font-semibold text-gray-900">Location on Map</h3>
                        </div>

                        {API_KEY && isLoaded && !loadError ? (
                            <div className="w-full border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                                <GoogleMap
                                    mapContainerStyle={mapContainerStyle}
                                    center={mapCenter}
                                    zoom={15}
                                    onLoad={onMapLoad}
                                    options={{
                                        streetViewControl: true,
                                        mapTypeControl: true,
                                        fullscreenControl: true,
                                        zoomControl: true,
                                        styles: [
                                            {
                                                featureType: "poi",
                                                elementType: "labels",
                                                stylers: [{ visibility: "on" }]
                                            }
                                        ]
                                    }}
                                >
                                    {/* Simplified Marker */}
                                    <Marker
                                        position={mapCenter}
                                        title={`${location.name || 'Location'}\n${location.address || ''}\nCoordinates: ${location.latitude?.toFixed(6)}, ${location.longitude?.toFixed(6)}`}
                                        icon={createMarkerIcon()}
                                    />
                                </GoogleMap>
                            </div>
                        ) : API_KEY && !isLoaded ? (
                            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-3"></div>
                                    <p className="text-gray-600">Loading map...</p>
                                </div>
                            </div>
                        ) : loadError ? (
                            <div className="w-full h-96 bg-red-50 rounded-lg flex items-center justify-center border border-red-200">
                                <div className="text-center">
                                    <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                                    <p className="text-red-600 font-medium">Failed to load map</p>
                                    <p className="text-red-500 text-sm">Please check your internet connection</p>
                                </div>
                            </div>
                        ) : (
                            <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center border border-gray-300">
                                <div className="text-center">
                                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 font-medium">Map preview unavailable</p>
                                    <p className="text-gray-500 text-sm">Google Maps API key not configured</p>
                                    <div className="mt-3 text-gray-500 text-xs">
                                        <p>Coordinates: {location.latitude?.toFixed(6)}, {location.longitude?.toFixed(6)}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Left Column - Basic Information */}
                        <div className="space-y-6">
                            {/* Basic Location Information */}
                            <div className="bg-blue-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <MapPin className="w-5 h-5 text-blue-600" />
                                    <h3 className="font-semibold text-gray-900">Location Information</h3>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Location Name</label>
                                        <p className="text-gray-900 font-medium text-lg">
                                            {location.name || 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                                        <div className="flex items-start gap-2">
                                            <Navigation className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" />
                                            <p className="text-gray-900">{location.address || 'No address provided'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Coordinates</label>
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-gray-500" />
                                            <p className="text-gray-900 font-mono text-sm">
                                                {formatCoordinates(location.latitude, location.longitude)}
                                            </p>
                                            <button
                                                onClick={copyCoordinates}
                                                className={`${isCopied ? 'text-green-600' : 'text-blue-600 hover:text-blue-800 underline'} text-sm`}
                                                title="Copy coordinates"
                                            >
                                                {isCopied ? 'Copied!' : 'Copy'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="bg-green-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Globe className="w-5 h-5 text-green-600" />
                                    <h3 className="font-semibold text-gray-900">Quick Actions</h3>
                                </div>
                                <div className="space-y-2">
                                    <button
                                        onClick={openInGoogleMaps}
                                        className="w-full flex items-center gap-2 p-3 bg-white rounded border hover:bg-gray-50 transition-colors"
                                    >
                                        <Globe className="w-4 h-4 text-blue-600" />
                                        <span className="text-gray-900">Open in Google Maps</span>
                                    </button>
                                    <button
                                        onClick={openInOpenStreetMap}
                                        className="w-full flex items-center gap-2 p-3 bg-white rounded border hover:bg-gray-50 transition-colors"
                                    >
                                        <MapPin className="w-4 h-4 text-orange-600" />
                                        <span className="text-gray-900">Open in OpenStreetMap</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Additional Information */}
                        <div className="space-y-6 grid grid-rows-1">
                            {/* Timeline Information */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Calendar className="w-5 h-5 text-gray-600" />
                                    <h3 className="font-semibold text-gray-900">Timeline</h3>
                                </div>
                                <div className="space-y-3">
                                    {location.created_at && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Created At</label>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-900">{formatDate(location.created_at)}</span>
                                            </div>
                                        </div>
                                    )}
                                    {location.updated_at && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Last Updated</label>
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4 text-gray-500" />
                                                <span className="text-gray-900">{formatDate(location.updated_at)}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Location Statistics */}
                            <div className="bg-purple-50 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <Navigation className="w-5 h-5 text-purple-600" />
                                    <h3 className="font-semibold text-gray-900">Location Details</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="text-center p-3 bg-white rounded border">
                                        <p className="text-2xl font-bold text-green-600">
                                            {location.latitude >= 0 ? 'N' : 'S'}
                                        </p>
                                        <p className="text-sm text-gray-600">Hemisphere</p>
                                    </div>
                                    <div className="text-center p-3 bg-white rounded border">
                                        <p className="text-2xl font-bold text-blue-600">
                                            {location.longitude >= 0 ? 'E' : 'W'}
                                        </p>
                                        <p className="text-sm text-gray-600">Direction</p>
                                    </div>
                                </div>
                                <div className="mt-3 p-3 bg-white rounded border">
                                    <div className="text-center">
                                        <p className="text-lg font-semibold text-gray-900">
                                            {Math.abs(location.latitude).toFixed(4)}°, {Math.abs(location.longitude).toFixed(4)}°
                                        </p>
                                        <p className="text-sm text-gray-600">Absolute Coordinates</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Map Controls Info */}
                        <div className="bg-blue-50 rounded-lg p-4 col-span-2">
                            <div className="flex items-center gap-2 mb-3">
                                <Navigation className="w-5 h-5 text-blue-600" />
                                <h3 className="font-semibold text-gray-900">Map Features</h3>
                            </div>
                            <div className="space-y-2 text-sm text-gray-700">
                                <p>• Street View available (click street view icon)</p>
                                <p>• Multiple map types (satellite, terrain)</p>
                                <p>• Zoom controls for detailed view</p>
                                <p>• Full screen mode supported</p>
                                <p>• Points of interest displayed</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ViewLocationModal;