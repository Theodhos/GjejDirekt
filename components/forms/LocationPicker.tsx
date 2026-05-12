"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { MapPinned, LocateFixed, Loader2 } from "lucide-react";

declare global {
  interface Window {
    google?: any;
  }
}

type LocationPickerProps = {
  label?: string;
  name?: string;
  required?: boolean;
  helperText?: string;
  defaultValue?: string;
  defaultCoordinates?: {
    lat?: number;
    lng?: number;
  };
};

const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export default function LocationPicker({
  label = "Location",
  name = "location",
  required = false,
  helperText = "Choose a real place from the map so the listing is pinned more accurately.",
  defaultValue = "",
  defaultCoordinates
}: LocationPickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<any>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const [scriptReady, setScriptReady] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [coordinates, setCoordinates] = useState({
    lat: typeof defaultCoordinates?.lat === "number" ? String(defaultCoordinates.lat) : "",
    lng: typeof defaultCoordinates?.lng === "number" ? String(defaultCoordinates.lng) : ""
  });

  function syncMap(lat: number, lng: number) {
    if (!window.google || !mapRef.current) return;
    const google = window.google;

    if (!mapInstanceRef.current) {
      mapInstanceRef.current = new google.maps.Map(mapRef.current, {
        center: { lat, lng },
        zoom: 13,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        gestureHandling: "greedy"
      });
    } else {
      mapInstanceRef.current.setCenter({ lat, lng });
      mapInstanceRef.current.setZoom(13);
    }

    if (!markerRef.current) {
      markerRef.current = new google.maps.Marker({
        map: mapInstanceRef.current,
        position: { lat, lng }
      });
    } else {
      markerRef.current.setPosition({ lat, lng });
      markerRef.current.setMap(mapInstanceRef.current);
    }
  }

  function geocodeLocation(query: string) {
    if (!window.google) return;
    if (!geocoderRef.current) {
      geocoderRef.current = new window.google.maps.Geocoder();
    }

    geocoderRef.current.geocode({ address: query }, (results: any, status: string) => {
      if (status !== "OK" || !results?.[0]) return;
      const location = results[0].geometry?.location;
      if (!location) return;

      const lat = location.lat();
      const lng = location.lng();
      setCoordinates({ lat: String(lat), lng: String(lng) });
      syncMap(lat, lng);
    });
  }

  useEffect(() => {
    if (!scriptReady || !window.google || !inputRef.current) return;

    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      fields: ["geometry", "formatted_address", "name"]
    });

    autocompleteRef.current = autocomplete;

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const nextValue = place.formatted_address || place.name || inputRef.current?.value || "";
      setValue(nextValue);

      const lat = place.geometry?.location?.lat?.();
      const lng = place.geometry?.location?.lng?.();
      if (typeof lat === "number" && typeof lng === "number") {
        setCoordinates({ lat: String(lat), lng: String(lng) });
        syncMap(lat, lng);
      }
    });

    if (defaultCoordinates?.lat && defaultCoordinates?.lng) {
      syncMap(defaultCoordinates.lat, defaultCoordinates.lng);
    } else if (defaultValue) {
      geocodeLocation(defaultValue);
    }

    return () => {
      autocompleteRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptReady]);

  function handleBlur() {
    if (!coordinates.lat || !coordinates.lng) {
      const trimmed = value.trim();
      if (trimmed) {
        geocodeLocation(trimmed);
      }
    }
  }

  return (
    <div className="space-y-3">
      {googleMapsApiKey ? (
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`}
          strategy="afterInteractive"
          onLoad={() => setScriptReady(true)}
        />
      ) : null}

      <label className="block space-y-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <div className="flex items-center gap-3 rounded-3xl border border-slate-200 bg-white px-4 py-3">
          <MapPinned className="h-4 w-4 shrink-0 text-brand-700" />
          <input
            ref={inputRef}
            name={name}
            value={value}
            onChange={(event) => {
              setValue(event.target.value);
              setCoordinates({ lat: "", lng: "" });
            }}
            onBlur={handleBlur}
            placeholder="Type a city, street, or landmark"
            required={required}
            className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
          />
          <LocateFixed className="h-4 w-4 shrink-0 text-slate-400" />
        </div>
      </label>

      <input type="hidden" name="coordinatesLat" value={coordinates.lat} />
      <input type="hidden" name="coordinatesLng" value={coordinates.lng} />

      <div className="overflow-hidden rounded-[1.5rem] border border-slate-200 bg-slate-50">
        <div ref={mapRef} className="h-56 w-full bg-slate-200" />
        <div className="flex items-center justify-between gap-3 border-t border-slate-200 px-4 py-3 text-xs text-slate-500">
          <span className="inline-flex items-center gap-2">
            <Loader2 className={`h-3.5 w-3.5 ${googleMapsApiKey && !scriptReady ? "animate-spin" : "hidden"}`} />
            {googleMapsApiKey ? (scriptReady ? "Map is ready for place picking" : "Loading map helper...") : "Google Maps key is missing"}
          </span>
          <span className="font-medium text-slate-600">
            {coordinates.lat && coordinates.lng ? `Pinned: ${coordinates.lat}, ${coordinates.lng}` : "No coordinates chosen yet"}
          </span>
        </div>
      </div>

      <p className="text-xs leading-5 text-slate-500">{helperText}</p>
    </div>
  );
}
