"use client";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

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
  // create icons once
  const userIcon = L.icon({
    iconUrl: userLocation.iconUrl,
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
    className: "rounded-full border-2 border-white shadow-md",
  });

  const getFamilyIcon = (url: string) =>
    L.icon({
      iconUrl: url,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32],
      className: "rounded-full border-2 border-white shadow-md",
    });

  return (
    <MapContainer
      center={[userLocation.lat, userLocation.lng]}
      zoom={14}
      scrollWheelZoom
      style={{ height: "100%", width: "100%" }}
      key="leaflet-map" // ensure React treats it as single instance
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* User */}
      <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
        <Popup><b>You</b></Popup>
      </Marker>

      {/* Family Members */}
      {familyMembers.map((member) => (
        <Marker
          key={member.name}
          position={[member.lat, member.lng]}
          icon={getFamilyIcon(member.iconUrl)}
        >
          <Popup>
            <b>{member.name}</b> ({member.relation})
            <br />
            {member.online ? <span className="text-primary">Online</span> : <span className="text-muted-foreground">Offline</span>}
          </Popup>
        </Marker>
      ))}

      {/* 1km radius */}
      <Circle
        center={[userLocation.lat, userLocation.lng]}
        radius={1000}
        pathOptions={{ color: 'hsl(var(--primary))', fillColor: 'hsl(var(--primary))', fillOpacity: 0.1, weight: 1 }}
      />
    </MapContainer>
  );
}
