export const calculateCustomRoute = async ({
  map,
  pickup,
  dropoff,
  setPolylinePath,
  setDistance,
  setDuration,
}) => {
  if (!window.google || !map) return;

  const directionsService = new window.google.maps.DirectionsService();

  try {
    const result = await directionsService.route({
      origin: pickup,     // { lat, lng } or address string
      destination: dropoff,
      travelMode: window.google.maps.TravelMode.DRIVING,
    });

    const route = result.routes[0];
    const leg = route.legs[0];

    // Update distance and duration
    setDistance(leg.distance.text);
    setDuration(leg.duration.text);

    // Update polyline path
    setPolylinePath(route.overview_path);

    // Fit the route in the map viewport
    const bounds = new window.google.maps.LatLngBounds();
    leg.steps.forEach((step) => {
      bounds.extend(step.start_location);
      bounds.extend(step.end_location);
    });
    map.fitBounds(bounds);

    return {
      route,
      steps: leg.steps.map((step) => step.instructions), // Optional: return road directions
    };
  } catch (error) {
    console.error("Route calculation failed:", error);
  }
};
