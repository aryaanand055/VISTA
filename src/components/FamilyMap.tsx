"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

interface Member {
  name: string;
  relation: string;
  lat: number;
  lng: number;
  online: boolean;
  iconUrl: string;
}

interface Props {
  yourPosition: { lat: number; lng: number; };
  familyMembers: Member[];
}

// Default icon fix for Leaflet in React
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = defaultIcon;


export default function FamilyMap({ yourPosition, familyMembers }: Props) {

  // create icons once
  const userIcon = (url: string) => L.icon({
    iconUrl: url,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "rounded-full border-2 border-primary shadow-lg",
  });

  const getFamilyIcon = (url: string, online: boolean) =>
    L.icon({
      iconUrl: url,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: `rounded-full border-2 border-white shadow-md ${!online ? 'grayscale' : ''}`,
    });

  // This check is important to prevent the error.
  if (typeof window === 'undefined') {
    return null;
  }

  return (
    <MapContainer center={yourPosition} zoom={15} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }} key={JSON.stringify(yourPosition)}>
        <TileLayer
            attribution='&amp;copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Your position */}
        <Marker position={[yourPosition.lat, yourPosition.lng]} icon={userIcon('https://picsum.photos/seed/person1/48/48')}>
            <Popup><b>You</b> are here.</Popup>
        </Marker>

        {/* Family Members */}
        {familyMembers.map((member) => (
            <Marker
            key={member.name}
            position={[member.lat, member.lng]}
            icon={getFamilyIcon(member.iconUrl, member.online)}
            opacity={member.online ? 1 : 0.6}
            >
            <Popup>
                <b>{member.name}</b> ({member.relation})
                <br />
                {member.online ? <span className="text-primary">Online</span> : <span className="text-muted-foreground">Offline</span>}
            </Popup>
            </Marker>
        ))}

        {/* 1km radius around you */}
        <Circle
            center={[yourPosition.lat, yourPosition.lng]}
            radius={1000}
            pathOptions={{ color: 'hsl(var(--primary))', fillColor: 'hsl(var(--primary))', fillOpacity: 0.1, weight: 1 }}
        />
    </MapContainer>
  );
}
