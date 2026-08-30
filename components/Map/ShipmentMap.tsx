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
import { useEffect, useState } from "react";

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

type Coordinate = [number, number];

function createIcon(
  color: string,
  symbol: string
) {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: ${color};
        border: 3px solid white;
        box-shadow: 0 3px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 17px;
        font-weight: 800;
        position: relative;
      ">
        ${symbol}
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
  });
}

function createCurrentIcon() {
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width: 70px;
        height: 70px;
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
      ">

        <div class="shipment-pulse-ring"></div>

        <div style="
          width: 38px;
          height: 38px;
          border-radius: 70%;
          background: #2563eb;
          border: 3px solid white;
          box-shadow: 0 3px 12px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 17px;
          font-weight: 800;
          position: relative;
          z-index: 2;
        ">
          🚚
        </div>

      </div>

      <style>
        @keyframes shipment-pulse {
          0% {
            transform: scale(0.55);
            opacity: 1.0;
          }

          70% {
            transform: scale(1.35);
            opacity: 0.8;
          }

          100% {
            transform: scale(1.35);
            opacity: 0.8;
          }
        }

        .shipment-pulse-ring {
          position: absolute;
          width: 48px;
          height: 48px;
          border-radius: 70%;
          background: rgba(37, 99, 235, 0.25);
          border: 2px solid rgba(37, 99, 235, 0.65);
          animation: shipment-pulse 2s ease-out infinite;
          z-index: 1;
        }
      </style>
    `,
    iconSize: [70, 70],
    iconAnchor: [35, 35],
    popupAnchor: [0, -35],
  });
}

const originIcon = createIcon(
  "#16a34a",
  "●"
);

const destinationIcon = createIcon(
  "#dc2626",
  "●"
);

const currentIcon = createCurrentIcon();

function MovingMarker({
  position,
}: {
  position: Coordinate;
}) {
  const [displayPosition, setDisplayPosition] =
    useState<Coordinate>(position);

  useEffect(() => {
    const start = displayPosition;
    const end = position;

    const duration = 2000;
    const startTime = performance.now();

    let animationFrame: number;

    function animate(currentTime: number) {
      const elapsed =
        currentTime - startTime;

      const progress = Math.min(
        elapsed / duration,
        1
      );

      const lat =
        start[0] +
        (end[0] - start[0]) *
          progress;

      const lng =
        start[1] +
        (end[1] - start[1]) *
          progress;

      setDisplayPosition([
        lat,
        lng,
      ]);

      if (progress < 1) {
        animationFrame =
          requestAnimationFrame(
            animate
          );
      }
    }

    animationFrame =
      requestAnimationFrame(
        animate
      );

    return () =>
      cancelAnimationFrame(
        animationFrame
      );
  }, [position]);

  return (
    <Marker
      position={displayPosition}
      icon={currentIcon}
    >
      <Popup>
        <div className="text-sm">
          <strong>
            Current Shipment Location
          </strong>

          <br />

          Shipment is currently in transit.
        </div>
      </Popup>
    </Marker>
  );
}

function MapController({
  points,
}: {
  points: Coordinate[];
}) {
  const map = useMap();

  useEffect(() => {
    if (points.length >= 2) {
      const bounds =
        L.latLngBounds(points);

      map.fitBounds(bounds, {
        padding: [60, 60],
        maxZoom: 6,
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
  const [route, setRoute] =
    useState<Coordinate[]>([]);

  const [routeLoading, setRouteLoading] =
    useState(true);

  const [routeError, setRouteError] =
    useState("");

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
        <div className="p-8 text-center">
          <p className="font-bold text-[var(--navy)]">
            Shipment map unavailable
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Location information is not available
            for this shipment.
          </p>
        </div>
      </div>
    );
  }

  const originPoint: Coordinate = [
    Number(originLat),
    Number(originLng),
  ];

  const destinationPoint: Coordinate = [
    Number(destinationLat),
    Number(destinationLng),
  ];

  const currentPoint: Coordinate | null =
    hasCurrent
      ? [
          Number(currentLat),
          Number(currentLng),
        ]
      : null;

  useEffect(() => {
    let cancelled = false;

    async function loadRoute() {
      try {
        setRouteLoading(true);
        setRouteError("");

        const body: {
          originLat: number;
          originLng: number;
          destinationLat: number;
          destinationLng: number;
          currentLat?: number;
          currentLng?: number;
        } = {
          originLat: Number(originLat),
          originLng: Number(originLng),
          destinationLat:
            Number(destinationLat),
          destinationLng:
            Number(destinationLng),
        };

        /*
         * If a current location exists,
         * send it as a waypoint.
         *
         * The routing service will therefore
         * calculate:
         *
         * Origin
         *    ↓
         * Current Location
         *    ↓
         * Destination
         */

        if (currentPoint) {
          body.currentLat =
            currentPoint[0];

          body.currentLng =
            currentPoint[1];
        }

        const response = await fetch(
          "/api/map/route",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(body),
            cache: "no-store",
          }
        );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Unable to calculate route."
          );
        }

        if (
          !Array.isArray(data.route) ||
          data.route.length < 2
        ) {
          throw new Error(
            "No valid route was returned."
          );
        }

        if (!cancelled) {
          setRoute(data.route);
          setRouteError("");
        }
      } catch (error) {
        console.error(
          "Shipment route error:",
          error
        );

        if (!cancelled) {
          setRouteError(
            "Unable to load the real shipment route."
          );

          setRoute([]);
        }
      } finally {
        if (!cancelled) {
          setRouteLoading(false);
        }
      }
    }

    loadRoute();

    return () => {
      cancelled = true;
    };
  }, [
  originLat,
  originLng,
  destinationLat,
  destinationLng,
  currentLat,
  currentLng,
]);

  /*
   * Fallback route only exists while the
   * real route is unavailable.
   */
  const fallbackRoute: Coordinate[] = [
    originPoint,
    ...(currentPoint
      ? [currentPoint]
      : []),
    destinationPoint,
  ];

  const displayedPoints =
    route.length >= 2
      ? route
      : fallbackRoute;

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-5 py-5 sm:px-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <h3 className="text-lg font-extrabold text-[var(--navy)]">
              Live Shipment Tracking
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              {origin} → {destination}
            </p>
          </div>

          {currentPoint &&
            !routeLoading && (
              <div className="flex w-fit items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700">
                <span className="h-2 w-2 animate-pulse rounded-full bg-blue-600" />

                Shipment in transit
              </div>
            )}

        </div>

        {routeError &&
          route.length < 2 && (
            <p className="mt-3 text-xs font-medium text-red-600">
              {routeError}
            </p>
          )}

      </div>

      {/* Map */}
      <MapContainer
        center={originPoint}
        zoom={4}
        scrollWheelZoom={true}
        className="h-[420px] w-full"
      >
        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapController
          points={displayedPoints}
        />

        {/* Real road route */}
        {route.length >= 2 && (
          <>
            <Polyline
              positions={route}
              pathOptions={{
                color: "#93c5fd",
                weight: 10,
                opacity: 0.25,
                lineCap: "round",
                lineJoin: "round",
              }}
            />

            <Polyline
              positions={route}
              pathOptions={{
                color: "#2563eb",
                weight: 5,
                opacity: 0.9,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </>
        )}

        {/* Temporary fallback */}
        {route.length < 2 && (
          <Polyline
            positions={fallbackRoute}
            pathOptions={{
              color: "#94a3b8",
              weight: 4,
              opacity: 0.6,
              dashArray: "8 8",
            }}
          />
        )}

        {/* Origin */}
        <Marker
          position={originPoint}
          icon={originIcon}
        >
          <Popup>
            <div className="text-sm">
              <strong>Origin</strong>

              <br />

              {origin}
            </div>
          </Popup>
        </Marker>

        {/* Current location */}
        {currentPoint && (
          <MovingMarker
            position={currentPoint}
          />
        )}

        {/* Destination */}
        <Marker
          position={destinationPoint}
          icon={destinationIcon}
        >
          <Popup>
            <div className="text-sm">
              <strong>
                Destination
              </strong>

              <br />

              {destination}
            </div>
          </Popup>
        </Marker>

      </MapContainer>

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-5 border-t border-gray-200 bg-white px-5 py-4 text-xs font-semibold text-gray-600 sm:px-6">

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-green-600" />
          Origin
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-blue-600" />
          Current Location
        </div>

        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-red-600" />
          Destination
        </div>

      </div>
    </div>
  );
}
