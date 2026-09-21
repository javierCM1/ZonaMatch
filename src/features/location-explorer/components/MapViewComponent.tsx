
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapViewProps {
  latitude?: number
  longitude?: number
  zoom?: number
  className?: string
}

const DEFAULT_LATITUDE = -34.6037
const DEFAULT_LONGITUDE = -58.3816
const DEFAULT_ZOOM = 12

export function MapView({
  latitude = DEFAULT_LATITUDE,
  longitude = DEFAULT_LONGITUDE,
  zoom = DEFAULT_ZOOM,
  className = '',
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    const map = L.map(mapContainerRef.current).setView(
      [latitude, longitude],
      zoom,
    )

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      },
    ).addTo(map)

    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    if (!mapRef.current) {
      return
    }

    mapRef.current.setView(
      [latitude, longitude],
      zoom,
    )
  }, [latitude, longitude, zoom])

  return (
    <div
      ref={mapContainerRef}
      className={`h-full w-full ${className}`}
    />
  )
}
