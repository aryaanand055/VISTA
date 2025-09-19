
'use client';
import { GoogleMap, useJsApiLoader, Polygon, MarkerF, InfoWindow } from '@react-google-maps/api';
import { useState, useMemo, useCallback } from 'react';
import { Loader2 } from 'lucide-react';
import { Card } from './ui/card';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const mapCenter = {
  lat: 27.5,
  lng: 88.5
};

interface MapProps {
  zones: any[];
  checkpoints: any[];
  userLocation?: { lat: number; lng: number } | null;
  onZoneClick: (zone: any) => void;
  onCheckpointClick: (checkpoint: any) => void;
  center?: { lat: number; lng: number };
}

export function GoogleMapComponent({ zones, checkpoints, userLocation, onZoneClick, onCheckpointClick, center }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
  });

  const [selectedCheckpoint, setSelectedCheckpoint] = useState<any>(null);

  const mapOptions = useMemo(() => ({
    mapId: 'e1c9d7a8d9a41a8a', // A custom map style from Google Cloud
    disableDefaultUI: true,
    zoomControl: true,
  }), []);

  const handleCheckpointClick = (checkpoint: any) => {
    setSelectedCheckpoint(checkpoint);
    onCheckpointClick(checkpoint);
  };
  
  if (!isLoaded) {
    return (
        <div className="flex h-full w-full items-center justify-center bg-muted">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
    )
  }

  if (!process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY === 'YOUR_API_KEY_HERE') {
    return (
        <Card className="h-full w-full flex items-center justify-center p-4 text-center">
            <div>
                <h3 className="font-bold text-lg text-destructive">Google Maps API Key Missing</h3>
                <p className="text-sm text-muted-foreground">
                    Please add your Google Maps API key to the <code className="bg-muted px-1 py-0.5 rounded-sm">.env</code> file to enable the interactive map.
                </p>
            </div>
        </Card>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center || mapCenter}
      zoom={8}
      options={mapOptions}
    >
      {/* Render Zones */}
      {zones.map((zone) => (
        <Polygon
          key={zone.name}
          paths={zone.paths}
          onClick={() => onZoneClick(zone)}
          options={{
            fillColor: zone.color,
            fillOpacity: 0.3,
            strokeColor: zone.color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
          }}
        />
      ))}

      {/* Render Checkpoints */}
      {checkpoints.map((checkpoint) => (
        <MarkerF
          key={checkpoint.name}
          position={{ lat: checkpoint.lat, lng: checkpoint.lng }}
          onClick={() => handleCheckpointClick(checkpoint)}
        />
      ))}

       {/* Selected Checkpoint Info Window */}
      {selectedCheckpoint && (
        <InfoWindow
          position={{ lat: selectedCheckpoint.lat, lng: selectedCheckpoint.lng }}
          onCloseClick={() => setSelectedCheckpoint(null)}
        >
          <div className="p-1">
            <h4 className="font-bold">{selectedCheckpoint.name}</h4>
            <p className="text-sm text-muted-foreground">{selectedCheckpoint.type}</p>
          </div>
        </InfoWindow>
      )}


      {/* Render User Location */}
      {userLocation && (
        <MarkerF
          position={{ lat: userLocation.lat, lng: userLocation.lng }}
          icon={{
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 8,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
          }}
        />
      )}
    </GoogleMap>
  );
}
