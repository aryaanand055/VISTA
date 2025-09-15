"use client";

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const familyMembers = [
  { name: "Rohan Sharma", relation: "Spouse", lat: 26.9124, lng: 75.7873, online: true, iconUrl: "https://picsum.photos/seed/person2/48/48" },
  { name: "Aarav Sharma", relation: "Son", lat: 26.9180, lng: 75.7920, online: true, iconUrl: "https://picsum.photos/seed/person3/48/48" },
  { name: "Ananya Sharma", relation: "Daughter", lat: 26.9080, lng: 75.7820, online: false, iconUrl: "https://picsum.photos/seed/person4/48/48" },
];

const userLocation = { lat: 26.9150, lng: 75.7890 };
const userIconUrl = "https://picsum.photos/seed/person1/48/48";

export default function TrackingPage() {
  const MapContainer = useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.MapContainer), { ssr: false }), []);
  const TileLayer = useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.TileLayer), { ssr: false }), []);
  const Marker = useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.Marker), { ssr: false }), []);
  const Popup = useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.Popup), { ssr: false }), []);
  const Circle = useMemo(() => dynamic(() => import('react-leaflet').then(mod => mod.Circle), { ssr: false }), []);
  
  const getIcon = (url: string, size: number) => {
    if (typeof window !== "undefined") {
      return L.icon({
        iconUrl: url,
        iconSize: [size, size],
        iconAnchor: [size / 2, size],
        popupAnchor: [0, -size],
        className: 'rounded-full'
      });
    }
    return new L.Icon.Default();
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-headline text-3xl font-bold tracking-tight">Family Tracking</h1>
          <p className="text-muted-foreground">Live map of your family members' locations in Jaipur.</p>
        </div>
      </header>

      <div className="h-[600px] w-full rounded-lg overflow-hidden border shadow">
        <MapContainer
          center={[userLocation.lat, userLocation.lng]}
          zoom={14}
          scrollWheelZoom={true}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[userLocation.lat, userLocation.lng]} icon={getIcon(userIconUrl, 40)}>
            <Popup><b>You (Priya)</b> are here.</Popup>
          </Marker>
          {familyMembers.map((member) => (
            <Marker key={member.name} position={[member.lat, member.lng]} icon={getIcon(member.iconUrl, 32)}>
              <Popup>
                <b>{member.name}</b> ({member.relation})
                <br />
                <span className={member.online ? 'text-green-600' : 'text-gray-500'}>
                  {member.online ? "Online" : "Offline"}
                </span>
              </Popup>
            </Marker>
          ))}
          <Circle center={[userLocation.lat, userLocation.lng]} radius={1000} pathOptions={{ color: 'hsl(var(--primary))', fillOpacity: 0.1 }} />
        </MapContainer>
      </div>
    </div>
  );
}