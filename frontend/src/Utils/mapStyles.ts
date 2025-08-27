// utils/mapStyles.ts

export const lightMapStyle = [
  {
    featureType: "all",
    elementType: "all",
    stylers: [{ saturation: 0 }, { lightness: 0 }],
  },
  // Hide all labels except some road labels
  {
    featureType: "all",
    elementType: "labels",
    stylers: [{ visibility: "off" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ visibility: "simplified" }, { color: "#3a73b8" }],
  },
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ visibility: "simplified" }, { color: "#5a9bd8" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "on" }, { color: "#3a73b8" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "on" }, { color: "#5a9bd8" }],
  },
];

export const darkMapStyle = [
  {
    elementType: "geometry",
    stylers: [{ color: "#edf0f6" }],
  },
  {
    elementType: "labels.text.stroke",
    stylers: [{ visibility: "off" }],  // Hide stroke around labels for cleaner look
  },
  {
    elementType: "labels.text.fill",
    stylers: [{ color: "#3b3c40", visibility: "off" }], // Hide most labels
  },
  // Hide all roads first
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ visibility: "off" }],
  },
  // Show only highways with color
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ visibility: "simplified" }, { color: "#c4cce3" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "on" }, { color: "#c4cce3" }],
  },
  // Show arterials with lighter color
  {
    featureType: "road.arterial",
    elementType: "geometry",
    stylers: [{ visibility: "simplified" }, { color: "#c4cce3" }],
  },
  {
    featureType: "road.arterial",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "on" }, { color: "#c4cce3" }],
  },
  // Optionally, show some place labels (like city names)
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "on" }, { color: "#c4cce3" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ visibility: "off" }],  // Hide POI labels
  },
];
