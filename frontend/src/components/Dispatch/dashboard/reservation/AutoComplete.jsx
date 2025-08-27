import React, { useState, useEffect, useRef } from 'react';
import { LoadScript, Autocomplete, GoogleMap, DirectionsRenderer } from '@react-google-maps/api';


// Autocomplete Input Component
const AutocompleteInput = ({
    value,
    onChange,
    placeholder,
    className,
    required = false,
    onPlaceSelect
}) => {
    const [autocomplete, setAutocomplete] = useState(null);

    const onLoad = (autocompleteInstance) => {
        setAutocomplete(autocompleteInstance);
    };

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.formatted_address) {
                onChange({ target: { value: place.formatted_address } });
                if (onPlaceSelect) {
                    onPlaceSelect(place);
                }
            }
        }
    };

    return (
        <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={onPlaceChanged}
            options={{
                types: ['address'],
            }}
        
        >
            <input
                type="text"
                value={value}
                onChange={onChange}
                className={className}
                placeholder={placeholder}
                required={required}
            />
        </Autocomplete>
    );
};

export default AutocompleteInput