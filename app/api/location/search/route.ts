import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim();

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    const url = new URL(
      "https://nominatim.openstreetmap.org/search"
    );

    url.searchParams.set("format", "jsonv2");
    url.searchParams.set("addressdetails", "1");
    url.searchParams.set("limit", "5");
    url.searchParams.set("q", query);

    const response = await fetch(url.toString(), {
      headers: {
        "User-Agent":
          "TrackLinkExpress/1.0 (tracklinkexpress.com)",
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Nominatim error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      return NextResponse.json(
        { error: "Location search temporarily unavailable." },
        { status: 502 }
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