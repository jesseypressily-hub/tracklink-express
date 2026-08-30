import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=jsonv2&addressdetails=1&limit=5&q=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "User-Agent": "TrackLinkExpress/1.0",
        },
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Location search failed." },
        { status: 500 }
      );
    }

    const results = await response.json();

    const locations = results.map((place: any) => ({
      name: place.display_name,
      latitude: Number(place.lat),
      longitude: Number(place.lon),
      type: place.type,
    }));

    return NextResponse.json(locations);
  } catch (error) {
    console.error("Location search error:", error);

    return NextResponse.json(
      { error: "Unable to search locations." },
      { status: 500 }
    );
  }
}