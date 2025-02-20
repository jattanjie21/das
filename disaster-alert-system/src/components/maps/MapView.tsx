'use client';

import { useState } from 'react';
import Map, { Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapViewProps {
  initialViewState?: {
    longitude: number;
    latitude: number;
    zoom: number;
  };
}

export const MapView = ({ 
  initialViewState = {
    longitude: -16.5780,
    latitude: 13.4432,
    zoom: 7
  }
}: MapViewProps) => {
  const [viewState, setViewState] = useState(initialViewState);

  return (
    <Map
      {...viewState}
      onMove={evt => setViewState(evt.viewState)}
      style={{ width: '100%', height: '500px' }}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
    >
      <NavigationControl />
    </Map>
  );
}; 