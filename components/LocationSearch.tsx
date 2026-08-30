"use client";

import { useEffect, useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

export type SelectedLocation = {
  name: string;
  latitude: number;
  longitude: number;
};

type LocationSearchProps = {
  label: string;
  value: SelectedLocation | null;
  onChange: (location: SelectedLocation | null) => void;
  placeholder?: string;
};

export default function LocationSearch({
  label,
  value,
  onChange,
  placeholder = "Search for a city or location...",
}: LocationSearchProps) {
  const [query, setQuery] = useState(value?.name || "");
  const [results, setResults] = useState<SelectedLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (value) {
      setQuery(value.name);
    }
  }, [value]);

  useEffect(() => {
    const trimmedQuery = query.trim();

    if (trimmedQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Don't search again when a location has already been selected.
    if (value && value.name === query) {
      setResults([]);
      setShowResults(false);
      return;
    }

    const controller = new AbortController();

    const timeout = setTimeout(async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `/api/location/search?q=${encodeURIComponent(
            trimmedQuery
          )}`,
          {
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
  console.error("Location API error:", {
    status: response.status,
    statusText: response.statusText,
    data,
  });

  setResults([]);
  setShowResults(false);
  return;
}

        if (!Array.isArray(data)) {
          throw new Error(
            "Invalid location search response."
          );
        }

        const validResults: SelectedLocation[] =
          data
            .filter(
              (location: any) =>
                location &&
                typeof location.name === "string" &&
                Number.isFinite(
                  Number(location.latitude)
                ) &&
                Number.isFinite(
                  Number(location.longitude)
                )
            )
            .map((location: any) => ({
              name: location.name,
              latitude: Number(location.latitude),
              longitude: Number(location.longitude),
            }));

        setResults(validResults);
        setShowResults(validResults.length > 0);
      } catch (error: any) {
        if (error?.name === "AbortError") {
          return;
        }

        console.error(
          "Location search error:",
          error
        );

        setResults([]);
        setShowResults(false);
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query, value]);

  function handleSelect(
    location: SelectedLocation
  ) {
    setQuery(location.name);
    setResults([]);
    setShowResults(false);
    onChange(location);
  }

  function handleChange(newValue: string) {
    setQuery(newValue);

    if (value) {
      onChange(null);
    }

    setShowResults(true);
  }

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-bold text-gray-700">
        {label}
      </label>

      <div className="relative">
        <MapPin
          size={18}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
        />

        <input
          type="text"
          value={query}
          onChange={(event) =>
            handleChange(event.target.value)
          }
          onFocus={() => {
            if (results.length > 0) {
              setShowResults(true);
            }
          }}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-10 outline-none transition focus:border-[var(--blue)] focus:ring-4 focus:ring-blue-100"
        />

        {loading && (
          <Loader2
            size={18}
            className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin text-gray-400"
          />
        )}
      </div>

      {showResults && results.length > 0 && (
        <div className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-xl">
          {results.map((location, index) => (
            <button
              key={`${location.latitude}-${location.longitude}-${index}`}
              type="button"
              onClick={() =>
                handleSelect(location)
              }
              className="flex w-full items-start gap-3 border-b border-gray-100 px-4 py-3 text-left last:border-b-0 hover:bg-blue-50"
            >
              <MapPin
                size={18}
                className="mt-0.5 shrink-0 text-[var(--blue)]"
              />

              <span className="text-sm font-medium text-gray-700">
                {location.name}
              </span>
            </button>
          ))}
        </div>
      )}

      {query.trim().length >= 2 &&
        !loading &&
        results.length === 0 &&
        !value && (
          <p className="mt-2 text-xs text-gray-400">
            No matching locations found.
          </p>
        )}

      {value && (
        <p className="mt-2 text-xs font-semibold text-green-600">
          ✓ Location selected
        </p>
      )}
    </div>
  );
}