import { NextResponse } from "next/server";

type Coordinate = [number, number];

type RouteSegment = {
  route: Coordinate[];
  routeType: "road" | "long-distance";
  source:
    | "openrouteservice"
    | "long-distance";
  distance: number | null;
  duration: number | null;
};

type CountryResult = {
  countryCode: string | null;
  countryName: string | null;
};

function isValidCoordinate(
  lat: unknown,
  lng: unknown
): lat is number {
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180
  );
}

function toRadians(value: number) {
  return (value * Math.PI) / 180;
}

function haversineDistance(
  from: Coordinate,
  to: Coordinate
) {
  const earthRadius = 6_371_000;

  const lat1 = toRadians(from[0]);
  const lat2 = toRadians(to[0]);

  const deltaLat = toRadians(to[0] - from[0]);
  const deltaLng = toRadians(to[1] - from[1]);

  const a =
    Math.sin(deltaLat / 2) ** 2 +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltaLng / 2) ** 2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadius * c;
}

function interpolateGreatCircle(
  from: Coordinate,
  to: Coordinate,
  fraction: number
): Coordinate {
  const lat1 = toRadians(from[0]);
  const lon1 = toRadians(from[1]);

  const lat2 = toRadians(to[0]);
  const lon2 = toRadians(to[1]);

  const x1 =
    Math.cos(lat1) * Math.cos(lon1);

  const y1 =
    Math.cos(lat1) * Math.sin(lon1);

  const z1 = Math.sin(lat1);

  const x2 =
    Math.cos(lat2) * Math.cos(lon2);

  const y2 =
    Math.cos(lat2) * Math.sin(lon2);

  const z2 = Math.sin(lat2);

  let dot =
    x1 * x2 +
    y1 * y2 +
    z1 * z2;

  dot = Math.max(-1, Math.min(1, dot));

  const angle = Math.acos(dot);

  if (angle < 0.000001) {
    return from;
  }

  const sinAngle = Math.sin(angle);

  const weight1 =
    Math.sin((1 - fraction) * angle) /
    sinAngle;

  const weight2 =
    Math.sin(fraction * angle) /
    sinAngle;

  const x =
    weight1 * x1 +
    weight2 * x2;

  const y =
    weight1 * y1 +
    weight2 * y2;

  const z =
    weight1 * z1 +
    weight2 * z2;

  return [
    (Math.atan2(
      z,
      Math.sqrt(x * x + y * y)
    ) *
      180) /
      Math.PI,
    (Math.atan2(y, x) * 180) /
      Math.PI,
  ];
}

function createLongDistancePath(
  from: Coordinate,
  to: Coordinate
): Coordinate[] {
  const distance =
    haversineDistance(from, to);

  const segments = Math.max(
    24,
    Math.min(
      80,
      Math.ceil(distance / 150_000)
    )
  );

  return Array.from(
    { length: segments + 1 },
    (_, index) =>
      interpolateGreatCircle(
        from,
        to,
        index / segments
      )
  );
}

/*
 * Reverse-geocode a coordinate so the router knows
 * which country the shipment is currently in.
 *
 * This is only used for country classification.
 * It does NOT alter Firebase shipment data.
 */
async function getCountry(
  coordinate: Coordinate
): Promise<CountryResult> {
  try {
    const url =
      `https://nominatim.openstreetmap.org/reverse` +
      `?format=jsonv2` +
      `&lat=${encodeURIComponent(coordinate[0])}` +
      `&lon=${encodeURIComponent(coordinate[1])}` +
      `&zoom=3` +
      `&addressdetails=1`;

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent":
          "TrackLinkExpress/1.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(
        "Country lookup failed:",
        response.status
      );

      return {
        countryCode: null,
        countryName: null,
      };
    }

    const data = await response.json();

    return {
      countryCode:
        typeof data?.address?.country_code ===
        "string"
          ? data.address.country_code.toUpperCase()
          : null,

      countryName:
        typeof data?.address?.country ===
        "string"
          ? data.address.country
          : null,
    };
  } catch (error) {
    console.error(
      "Country lookup request failed:",
      error
    );

    return {
      countryCode: null,
      countryName: null,
    };
  }
}

/*
 * OpenRouteService is used only for genuinely
 * road-connected legs.
 */
async function getRoadRoute(
  from: Coordinate,
  to: Coordinate
): Promise<RouteSegment | null> {
  const apiKey =
    process.env.OPENROUTESERVICE_API_KEY;

  if (!apiKey) {
    console.error(
      "OPENROUTESERVICE_API_KEY is not configured."
    );

    return null;
  }

  try {
    /*
     * Current ORS endpoint.
     */
    const response = await fetch(
      "https://api.heigit.org/openrouteservice/v2/directions/driving-car/geojson",
      {
        method: "POST",

        headers: {
          Authorization: apiKey,
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          coordinates: [
            [from[1], from[0]],
            [to[1], to[0]],
          ],

          /*
           * Give ORS a larger search radius around
           * shipment locations that may have been
           * selected slightly away from a road.
           */
          radiuses: [5000, 5000],
        }),

        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "OpenRouteService error:",
        response.status,
        errorText
      );

      return null;
    }

    const data = await response.json();

    const geometry =
      data?.features?.[0]?.geometry
        ?.coordinates;

    if (
      !Array.isArray(geometry) ||
      geometry.length < 2
    ) {
      console.error(
        "OpenRouteService returned no valid route geometry."
      );

      return null;
    }

    const route: Coordinate[] =
      geometry
        .filter(
          (point: unknown) =>
            Array.isArray(point) &&
            point.length >= 2 &&
            typeof point[0] === "number" &&
            typeof point[1] === "number"
        )
        .map(
          (point: number[]) => [
            point[1],
            point[0],
          ]
        );

    if (route.length < 2) {
      return null;
    }

    const summary =
      data?.features?.[0]?.properties
        ?.summary;

    console.log(
      "OpenRouteService road route used successfully."
    );

    return {
      route,
      routeType: "road",
      source: "openrouteservice",
      distance:
        typeof summary?.distance ===
        "number"
          ? summary.distance
          : haversineDistance(
              from,
              to
            ),

      duration:
        typeof summary?.duration ===
        "number"
          ? summary.duration
          : null,
    };
  } catch (error) {
    console.error(
      "OpenRouteService request failed:",
      error
    );

    return null;
  }
}

/*
 * Build one shipment leg.
 *
 * The important rule:
 *
 * SAME COUNTRY
 *     -> road
 *
 * DIFFERENT COUNTRY
 *     -> international dashed path
 *
 * This means distance alone NEVER decides whether
 * a segment is dashed.
 */
async function buildLeg(
  from: Coordinate,
  to: Coordinate,
  fromCountry: string | null,
  toCountry: string | null
): Promise<RouteSegment> {
  const sameCountry =
    fromCountry !== null &&
    toCountry !== null &&
    fromCountry === toCountry;

  /*
   * If we know both points are in the same country,
   * route them by road regardless of distance.
   */
  if (sameCountry) {
    const roadRoute =
      await getRoadRoute(
        from,
        to
      );

    if (roadRoute) {
      return roadRoute;
    }

    /*
     * We deliberately DO NOT create a fake solid
     * blue road line here.
     *
     * If ORS cannot route it, use the geographic
     * path as a last-resort visual, but classify
     * it as long-distance rather than pretending
     * it is a road.
     */
    console.warn(
      "Domestic road routing failed. Using geographic fallback."
    );

    return {
      route:
        createLongDistancePath(
          from,
          to
        ),
      routeType: "long-distance",
      source: "long-distance",
      distance:
        haversineDistance(
          from,
          to
        ),
      duration: null,
    };
  }

  /*
   * Different countries:
   *
   * This represents the international transportation
   * portion of the shipment.
   */
  console.log(
    "Using international shipment path.",
    {
      fromCountry,
      toCountry,
    }
  );

  return {
    route:
      createLongDistancePath(
        from,
        to
      ),
    routeType: "long-distance",
    source: "long-distance",
    distance:
      haversineDistance(
        from,
        to
      ),
    duration: null,
  };
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const originLat =
      body.originLat;

    const originLng =
      body.originLng;

    const destinationLat =
      body.destinationLat;

    const destinationLng =
      body.destinationLng;

    const currentLat =
      body.currentLat;

    const currentLng =
      body.currentLng;

    if (
      !isValidCoordinate(
        originLat,
        originLng
      ) ||
      !isValidCoordinate(
        destinationLat,
        destinationLng
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid origin or destination coordinates.",
        },
        { status: 400 }
      );
    }

    const origin: Coordinate = [
      originLat,
      originLng,
    ];

    const destination: Coordinate = [
      destinationLat,
      destinationLng,
    ];

    const hasCurrentLocation =
      isValidCoordinate(
        currentLat,
        currentLng
      );

    const current: Coordinate | null =
      hasCurrentLocation
        ? [
            currentLat,
            currentLng,
          ]
        : null;

    /*
     * Determine the country of each important point.
     */
    const [
      originCountry,
      destinationCountry,
      currentCountry,
    ] = await Promise.all([
      getCountry(origin),
      getCountry(destination),
      current
        ? getCountry(current)
        : Promise.resolve({
            countryCode: null,
            countryName: null,
          }),
    ]);

    console.log(
      "Shipment route country classification:",
      {
        origin:
          originCountry.countryName,
        current:
          currentCountry.countryName,
        destination:
          destinationCountry.countryName,
      }
    );

    const segments: RouteSegment[] =
      [];

    /*
     * No current location:
     *
     * Same country -> road
     * Different countries -> international path
     */
    if (!current) {
      segments.push(
        await buildLeg(
          origin,
          destination,
          originCountry.countryCode,
          destinationCountry.countryCode
        )
      );
    } else {
      /*
       * Leg 1:
       * Origin -> Current
       */
      segments.push(
        await buildLeg(
          origin,
          current,
          originCountry.countryCode,
          currentCountry.countryCode
        )
      );

      /*
       * Leg 2:
       * Current -> Destination
       */
      segments.push(
        await buildLeg(
          current,
          destination,
          currentCountry.countryCode,
          destinationCountry.countryCode
        )
      );
    }

    const combinedRoute: Coordinate[] =
      segments.flatMap(
        (segment, index) =>
          index === 0
            ? segment.route
            : segment.route.slice(1)
      );

    const totalDistance =
      segments.reduce(
        (total, segment) =>
          total +
          (segment.distance ?? 0),
        0
      );

    const allRoad =
      segments.every(
        (segment) =>
          segment.routeType ===
          "road"
      );

    const allLongDistance =
      segments.every(
        (segment) =>
          segment.routeType ===
          "long-distance"
      );

    const routeType =
      allRoad
        ? "road"
        : allLongDistance
          ? "long-distance"
          : "mixed";

    const allHaveDuration =
      segments.every(
        (segment) =>
          typeof segment.duration ===
          "number"
      );

    const totalDuration =
      allHaveDuration
        ? segments.reduce(
            (total, segment) =>
              total +
              (segment.duration ?? 0),
            0
          )
        : null;

    return NextResponse.json({
      success: true,

      /*
       * Useful for debugging and later UI improvements.
       */
      countries: {
        origin:
          originCountry.countryName,
        current:
          currentCountry.countryName,
        destination:
          destinationCountry.countryName,
      },

      segments,

      route: combinedRoute,

      routeType,

      distance:
        totalDistance,

      duration:
        totalDuration,
    });
  } catch (error) {
    console.error(
      "Map route API error:",
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