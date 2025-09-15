"use client";
import dynamic from "next/dynamic";

const FamilyMap = dynamic(() => import("@/components/FamilyMap"), { 
  ssr: false,
  loading: () => <div className="h-full w-full rounded-lg bg-muted animate-pulse" />,
});

const familyMembers = [
  { name: "Rohan Sharma", relation: "Spouse", lat: 26.9124, lng: 75.7873, online: true, iconUrl: "https://picsum.photos/seed/person2/48/48" },
  { name: "Aarav Sharma", relation: "Son", lat: 26.9180, lng: 75.7920, online: true, iconUrl: "https://picsum.photos/seed/person3/48/48" },
  { name: "Ananya Sharma", relation: "Daughter", lat: 26.9080, lng: 75.7820, online: false, iconUrl: "https://picsum.photos/seed/person4/48/48" },
];

const userLocation = { lat: 26.9150, lng: 75.7890, iconUrl: "https://picsum.photos/seed/person1/48/48" };

export default function TrackingPage() {
  return (
    <div className="h-[600px] w-full rounded-lg border shadow-lg overflow-hidden">
      <FamilyMap userLocation={userLocation} familyMembers={familyMembers} />
    </div>
  );
}
