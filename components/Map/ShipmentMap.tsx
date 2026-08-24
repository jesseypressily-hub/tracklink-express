"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect } from "react";

const shipmentIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

type Coordinates = {
  lat: number;
  lng: number;
};

type ShipmentMapProps = {
  origin?: string;
  destination?: string;
  originLat?: number | string | null;
  originLng?: number | string | null;
  destinationLat?: number | string | null;
  destinationLng?: number | string | null;
  currentLat?: number | string | null;
  currentLng?: number | string | null;
};

function MapController({
  points,
}: {
  points: [number, number][];
}) {
  const map = useMap();

  useEffect(() => {
    if (points.length >= 2) {
      const bounds = L.latLngBounds(points);
      map.fitBounds(bounds, {
        padding: [40, 40],
      });
    }
  }, [map, points]);

  return null;
}

export default function ShipmentMap({
  origin = "Origin",
  destination = "Destination",
  originLat,
  originLng,
  destinationLat,
  destinationLng,
  currentLat,
  currentLng,
}: ShipmentMapProps) {
  const hasOrigin =
    originLat !== null &&
    originLat !== undefined &&
    originLng !== null &&
    originLng !== undefined;

  const hasDestination =
    destinationLat !== null &&
    destinationLat !== undefined &&
    destinationLng !== null &&
    destinationLng !== undefined;

  const hasCurrent =
    currentLat !== null &&
    currentLat !== undefined &&
    currentLng !== null &&
    currentLng !== undefined;

  if (!hasOrigin || !hasDestination) {
    return (
      <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        <div className="p-6 text-center">
          <p className="font-semibold text-[var(--navy)]">
            Shipment map unavailable
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Location information is not available for this shipment.
          </p>
        </div>
      </div>
    );
  }

  const originPoint: [number, number] = [
  Number(originLat),
  Number(originLng),
];

const destinationPoint: [number, number] = [
  Number(destinationLat),
  Number(destinationLng),
];

const currentPoint: [number, number] | null = hasCurrent
  ? [Number(currentLat), Number(currentLng)]
  : null;
  const mapPoints: [number, number][] = [
    originPoint,
    ...(currentPoint ? [currentPoint] : []),
    destinationPoint,
  ];

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200">
      <div className="border-b border-gray-200 bg-white px-5 py-4">
        <h3 className="font-bold text-[var(--navy)]">
          Shipment Route
        </h3>

        <p className="mt-1 text-sm text-gray-500">
          {origin} → {destination}
        </p>
      </div>

      <MapContainer
        center={originPoint}
        zoom={4}
        scrollWheelZoom={false}
        className="h-[350px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController points={mapPoints} />

        {/* Route */}
        <Polyline
          positions={mapPoints}
          pathOptions={{
            color: "#2563eb",
            weight: 4,
            opacity: 0.8,
          }}
        />

        {/* Origin */}
        <Marker
          position={originPoint}
          icon={shipmentIcon}
        >
          <Popup>
            <strong>Origin</strong>
            <br />
            {origin}
          </Popup>
        </Marker>

        {/* Current Shipment Location */}
        {currentPoint && (
          <Marker
            position={currentPoint}
            icon={shipmentIcon}
          >
            <Popup>
              <strong>Current Shipment Location</strong>
              <br />
              Your shipment is currently here.
            </Popup>
          </Marker>
        )}

        {/* Destination */}
        <Marker
          position={destinationPoint}
          icon={shipmentIcon}
        >
          <Popup>
            <strong>Destination</strong>
            <br />
            {destination}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}