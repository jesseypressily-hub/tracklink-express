import { NextResponse } from "next/server";

type RouteRequest = {
  originLat: number;
  originLng: number;
  destinationLat: number;
  destinationLng: number;
  currentLat?: number;
  currentLng?: number;
};

export async function POST(request: Request) {
  try {
    const apiKey =
      process.env.OPENROUTESERVICE_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "Routing service is not configured.",
        },
        { status: 500 }
      );
    }

    const body =
      (await request.json()) as Partial<RouteRequest>;

    const originLat = Number(body.originLat);
    const originLng = Number(body.originLng);

    const destinationLat =
      Number(body.destinationLat);
    const destinationLng =
      Number(body.destinationLng);

    const hasCurrent =
      body.currentLat !== undefined &&
      body.currentLng !== undefined &&
      Number.isFinite(Number(body.currentLat)) &&
      Number.isFinite(Number(body.currentLng));

    const currentLat = hasCurrent
      ? Number(body.currentLat)
      : null;

    const currentLng = hasCurrent
      ? Number(body.currentLng)
      : null;

    if (
      !Number.isFinite(originLat) ||
      !Number.isFinite(originLng) ||
      !Number.isFinite(destinationLat) ||
      !Number.isFinite(destinationLng)
    ) {
      return NextResponse.json(
        {
          error:
            "Valid origin and destination coordinates are required.",
        },
        { status: 400 }
      );
    }

    /*
     * OpenRouteService expects coordinates as:
     *
     * [longitude, latitude]
     *
     * When a current location exists, it becomes
     * a waypoint between origin and destination.
     */

    const coordinates: [number, number][] = [
      [originLng, originLat],
    ];

    if (
      currentLat !== null &&
      currentLng !== null
    ) {
      coordinates.push([
        currentLng,
        currentLat,
      ]);
    }

    coordinates.push([
      destinationLng,
      destinationLat,
    ]);

    const response = await fetch(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      {
        method: "POST",
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
          Accept:
            "application/geo+json, application/json",
        },
        body: JSON.stringify({
          coordinates,
          instructions: false,
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "OpenRouteService error:",
        response.status,
        data
      );

      return NextResponse.json(
        {
          error:
            "Unable to calculate the shipment route.",
        },
        { status: response.status }
      );
    }

    const feature = data?.features?.[0];

    if (
      !feature?.geometry?.coordinates ||
      !Array.isArray(
        feature.geometry.coordinates
      )
    ) {
      return NextResponse.json(
        {
          error:
            "The routing service returned no route.",
        },
        { status: 502 }
      );
    }

    /*
     * OpenRouteService:
     *
     * [longitude, latitude]
     *
     * Leaflet:
     *
     * [latitude, longitude]
     */

    const leafletCoordinates =
      feature.geometry.coordinates
        .filter(
          (coordinate: unknown) =>
            Array.isArray(coordinate) &&
            coordinate.length >= 2 &&
            Number.isFinite(
              Number(coordinate[0])
            ) &&
            Number.isFinite(
              Number(coordinate[1])
            )
        )
        .map(
          (
            coordinate: [number, number]
          ) =>
            [
              Number(coordinate[1]),
              Number(coordinate[0]),
            ] as [number, number]
        );

    if (leafletCoordinates.length < 2) {
      return NextResponse.json(
        {
          error:
            "The routing service returned an invalid route.",
        },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      route: leafletCoordinates,
      distance:
        feature.properties?.summary?.distance ??
        null,
      duration:
        feature.properties?.summary?.duration ??
        null,
    });
  } catch (error) {
    console.error(
      "Route API error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Unable to calculate shipment route.",
      },
      { status: 500 }
    );
  }
}
