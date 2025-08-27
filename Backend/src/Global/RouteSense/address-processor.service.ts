import { Injectable } from '@nestjs/common';
import axios from 'axios';

// Interface for Google Geocoding API response
interface GoogleGeocodeResponse {
  results: {
    address_components: {
      long_name: string;
      short_name: string;
      types: string[];
    }[];
  }[];
}

// Interface for Google Directions API response
interface GoogleDirectionsResponse {
  routes: {
    legs: {
      distance: { text: string; value: number };
      duration: { text: string; value: number };
      duration_in_traffic?: { text: string; value: number };
    }[];
  }[];
}



@Injectable()
export class AddressProcessorService {
  private readonly googleApiKey = 'AIzaSyBoiNvomF4gz-nIdpSe73zXQO31n_G99gQ'; // ⚠️ Replace with a secure method in production

  /**
   * Get structured street number and street name from a raw address
   */
  async getStreetNumber(address: string): Promise<string> {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address,
    )}&key=${this.googleApiKey}`;

    const response = await axios.get<GoogleGeocodeResponse>(url);
    const results = response.data.results;

    if (!results.length) throw new Error('Address not found');

    const addressComponents = results[0].address_components;
    const streetNumberObj = addressComponents.find((comp) =>
      comp.types.includes('street_number'),
    );
    const streetNameObj = addressComponents.find((comp) =>
      comp.types.includes('route'),
    );

    const streetNumber = streetNumberObj?.long_name || '';
    const streetName = streetNameObj?.long_name || '';

    return `${streetNumber} ${streetName}`.trim();
  }

  /**
   * Calculate distance and traffic condition between pickup and dropoff using Google Directions API
   */
  async calculateDistanceAndTraffic(
    pickup: string,
    dropoff: string,
  ): Promise<{ distance: number; duration: string; traffic: string }> {
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
      pickup,
    )}&destination=${encodeURIComponent(
      dropoff,
    )}&departure_time=now&key=${this.googleApiKey}`;

    const response = await axios.get<GoogleDirectionsResponse>(url);
    const route = response.data.routes?.[0]?.legs?.[0];

    if (!route) {
      throw new Error('Unable to calculate route');
    }

    const distanceMeters = route.distance.value;
    const durationText = route.duration.text;
    const trafficDuration =
      route.duration_in_traffic?.text || route.duration.text;

const baseDuration = route.duration.value;
const trafficDurationValue = route.duration_in_traffic?.value ?? baseDuration;

const traffic =
  trafficDurationValue > baseDuration * 1.25
    ? 'heavy'
    : trafficDurationValue > baseDuration * 1.1
    ? 'moderate'
    : 'light';


    return {
      distance: parseFloat((distanceMeters / 1000).toFixed(2)), // Convert to km
      duration: trafficDuration,
      traffic,
    };
  }
}
