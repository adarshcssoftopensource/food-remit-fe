import { NextRequest, NextResponse } from "next/server";

type GoogleAutocompletePrediction = {
  place_id: string;
  description: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
};

type GoogleAutocompleteResponse = {
  status: string;
  error_message?: string;
  predictions?: GoogleAutocompletePrediction[];
};

function getApiKey(): string | undefined {
  return (
    process.env.GOOGLE_PLACES_API_KEY?.trim() ||
    process.env.NEXT_PUBLIC_GOOGLE_PLACES_API_KEY?.trim()
  );
}

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("input")?.trim() ?? "";

  if (!input) {
    return NextResponse.json({ predictions: [] });
  }

  const apiKey = getApiKey();
  if (!apiKey) {
    return NextResponse.json({ error: "Google Places API key is not configured" }, { status: 500 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/autocomplete/json");
  url.searchParams.set("input", input);
  url.searchParams.set("key", apiKey);
  url.searchParams.set("language", "en");

  try {
    const response = await fetch(url.toString(), { cache: "no-store" });
    const data = (await response.json()) as GoogleAutocompleteResponse;

    if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
      console.error("[places/autocomplete]", data.status, data.error_message);
      return NextResponse.json(
        {
          error: data.error_message || `Google Places error: ${data.status}`,
          predictions: [],
        },
        { status: 502 },
      );
    }

    const predictions = (data.predictions ?? []).map((p) => ({
      placeId: p.place_id,
      mainText: p.structured_formatting?.main_text ?? "",
      secondaryText: p.structured_formatting?.secondary_text ?? "",
      description: p.description,
    }));

    return NextResponse.json({ predictions });
  } catch (error) {
    console.error("[places/autocomplete]", error);
    return NextResponse.json({ error: "Failed to fetch place suggestions" }, { status: 500 });
  }
}
