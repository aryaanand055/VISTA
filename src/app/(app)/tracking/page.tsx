"use client";

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const familyMembers = [
  { name: "Rohan Sharma", relation: "Spouse", lat: 26.1445, lng: 91.7362, online: true, iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png" },
  { name: "Aarav Sharma", relation: "Son", lat: 26.1480, lng: 91.7420, online: true, iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077012.png" },
  { name: "Ananya Sharma", relation: "Daughter", lat: 26.1410, lng: 91.7320, online: false, iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077063.png" },
];

const userLocation = { lat: 26.1450, lng: 91.7390 };
const userIconUrl = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

export default function TrackingPage() {
  const Map = useMemo(() => dynamic(() => import('@/components/map'), { 
    loading: () => <div className="h-full w-full bg-muted animate-pulse" />,
    ssr: false 
  }), []);

  const getIcon = (url: string, size: number) => {
    if (typeof window !== "undefined") {
      return L.icon({
        iconUrl: url,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
      });
    }
    // Return a dummy icon for server-side rendering
    return new L.Icon.Default();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Family Tracking</h1>
          <p className="text-muted-foreground">Live map of your family members' locations.</p>
        </div>
      </header>

      <div className="h-[600px] w-full rounded-lg overflow-hidden border shadow">
        <Map
          center={[userLocation.lat, userLocation.lng]}
          zoom={15}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          {({ TileLayer, Marker, Popup, Circle }) => (
            <>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              <Marker position={[userLocation.lat, userLocation.lng]} icon={getIcon(userIconUrl, 32)}>
                <Popup><b>You</b> are here.</Popup>
              </Marker>
              {familyMembers.map((member) => (
                <Marker key={member.name} position={[member.lat, member.lng]} icon={getIcon(member.iconUrl, 28)}>
                  <Popup>
                    <b>{member.name}</b> ({member.relation})
                    <br />
                    {member.online ? "Online" : "Offline"}
                  </Popup>
                </Marker>
              ))}
              <Circle center={[userLocation.lat, userLocation.lng]} radius={1000} pathOptions={{ color: 'blue', fillOpacity: 0.1 }} />
            </>
          )}
        </Map>
      </div>
    </div>
  );
}
