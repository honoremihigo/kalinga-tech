import {
  GoogleMap,
  LoadScript,
  Marker,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useState } from "react";

const containerStyle = {
  width: "100%",
  height: "500px",
};

const MapWithRoute = ({ start, end }) => {
  const [directions, setDirections] = useState(null);

  return (
    <LoadScript googleMapsApiKey={import.meta.env.VITE_GOOGLE_PLACES_API}>
      <GoogleMap mapContainerStyle={containerStyle} center={start} zoom={13}>
        <Marker position={start} />
        <Marker position={end} />

        <DirectionsService
          options={{
            destination: end,
            origin: start,
            travelMode: "DRIVING",
          }}
          callback={(result, status) => {
            if (status === "OK") {
              setDirections(result);
            }
          }}
        />

        {directions && (
          <DirectionsRenderer
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "black",
                strokeWeight: 4,
              },
            }}
          />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapWithRoute;
