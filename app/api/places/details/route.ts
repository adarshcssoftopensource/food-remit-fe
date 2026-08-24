import { parsePlaceAddress, type GoogleAddressComponent } from "@/lib/places/parse-place-address";
import { NextRequest, NextResponse } from "next/server";

type GooglePlaceDetailsResponse = {
  status: string;
  error_message?: string;
  result?: {
    name?: string;
    formatted_address?: string;
    address_components?: GoogleAddressComponent[];
    geometry?: {
      location?: {
        lat: number;
        lng: number;
      };
    };
  };
};

function getApiKey(): string | undefined {
  return (
    process.env.GOOGLE_PLACES_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY?.trim()
  );
}

export async function GET(request: NextRequest) {
  const placeId = request.nextUrl.searchParams.get("placeId")?.trim() ?? "";

  if (!placeId) {
    return NextResponse.json({ error: "placeId is required" }, { status: 400 });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({ error: "Google Places API key is not configured" }, { status: 500 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", "name,formatted_address,geometry,address_component");
  url.searchParams.set("key", apiKey);
  url.searchParams.set("language", "en");

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    const data = (await response.json()) as GooglePlaceDetailsResponse;

    if (data.status !== "OK" || !data.result) {
      console.error("[places/details]", data.status, data.error_message);
      return NextResponse.json(
        { error: data.error_message || `Google Places error: ${data.status}` },
        { status: 502 },
      );
    }

    const parsed = parsePlaceAddress({
      addressComponents: data.result.address_components,
      formattedAddress: data.result.formatted_address,
      name: data.result.name,
    });

    return NextResponse.json({
      placeId,
      formattedAddress: parsed.formattedAddress,
      streetAddress: parsed.streetAddress,
      country: parsed.country,
      countryCode: parsed.countryCode,
      state: parsed.state,
      stateCode: parsed.stateCode,
      city: parsed.city,
      postalCode: parsed.postalCode,
      lat: data.result.geometry?.location?.lat,
      lng: data.result.geometry?.location?.lng,
      name: data.result.name,
    });
  } catch (error) {
    console.error("[places/details]", error);
    return NextResponse.json({ error: "Failed to fetch place details" }, { status: 500 });
  }
}
