// components/FamilyMap.tsx
"use client";

import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { Icon as LeafletIcon } from "leaflet";

interface Member {
  name: string;
  relation: string;
  lat: number;
  lng: number;
  online: boolean;
  iconUrl: string;
}

interface Props {
  userLocation: { lat: number; lng: number; iconUrl: string };
  familyMembers: Member[];
}

export default function FamilyMap({ userLocation, familyMembers }: Props) {
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    import("leaflet").then((leaflet) => {
      setL(() => leaflet);
    });
  }, []);

  const getIcon = (url: string, size: number): LeafletIcon | undefined => {
    if (!L) return undefined;
    return L.icon({
      iconUrl: url,
      iconSize: [size, size],
      iconAnchor: [size / 2, size],
      popupAnchor: [0, -size],
      className: "rounded-full border-2 border-white shadow-md",
    });
  };
  
  const userIcon = getIcon(userLocation.iconUrl, 40);

  if (!L || !userIcon) {
    return <div className="h-full w-full rounded-lg bg-muted animate-pulse" />;
  }

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={14}
      scrollWheelZoom
      className="h-full w-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />
      {/* User */}
      <Marker
        position={[userLocation.lat, userLocation.lng]}
        icon={userIcon}
      >
        <Popup><b>You</b></Popup>
      </Marker>

      {/* Family Members */}
      {familyMembers.map((member) => {
        const memberIcon = getIcon(member.iconUrl, 32);
        if (!memberIcon) return null;
        return (
          <Marker
            key={member.name}
            position={[member.lat, member.lng]}
            icon={memberIcon}
          >
            <Popup>
              <b>{member.name}</b> ({member.relation})
              <br />
              <span className={member.online ? "text-primary" : "text-muted-foreground"}>
                {member.online ? "Online" : "Offline"}
              </span>
            </Popup>
          </Marker>
        );
      })}

      {/* Radius */}
      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={1000}
        pathOptions={{ color: 'hsl(var(--primary))', fillColor: 'hsl(var(--primary))', fillOpacity: 0.1, weight: 1 }}
      />
    </MapContainer>
  );
}
