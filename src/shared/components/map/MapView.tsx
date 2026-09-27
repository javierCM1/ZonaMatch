
import { useEffect, useRef } from 'react'
import L from 'leaflet'
import type { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapViewProps {
  latitude?: number
  longitude?: number
  zoom?: number
  className?: string
  selectedArea?: LatLngExpression[]
  selectedMarker?: {
    latitude: number
    longitude: number
    label?: string
  }
}

const DEFAULT_LATITUDE = -34.6037
const DEFAULT_LONGITUDE = -58.3816
const DEFAULT_ZOOM = 12
const AMBA_BOUNDS: LatLngExpression[] = [
  [-35.2, -59.4],
  [-34.25, -58.0],
]

export function MapView({
  latitude = DEFAULT_LATITUDE,
  longitude = DEFAULT_LONGITUDE,
  zoom = DEFAULT_ZOOM,
  className = '',
  selectedArea,
  selectedMarker,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const mapRef = useRef<L.Map | null>(null)
  const overlayLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return
    }

    const map = L.map(mapContainerRef.current, {
      minZoom: 10,
      maxZoom: 18,
      maxBounds: L.latLngBounds(AMBA_BOUNDS),
      maxBoundsViscosity: 1,
      zoomControl: false,
    }).setView([DEFAULT_LATITUDE, DEFAULT_LONGITUDE], DEFAULT_ZOOM)

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution:
          '',
        maxZoom: 19,
      },
    ).addTo(map)

    mapRef.current = map
    overlayLayerRef.current = L.layerGroup().addTo(map)
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize({ pan: false })
    })
    resizeObserver.observe(mapContainerRef.current)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      overlayLayerRef.current = null
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

  useEffect(() => {
    const overlayLayer = overlayLayerRef.current

    if (!overlayLayer) {
      return
    }

    overlayLayer.clearLayers()

    if (selectedArea && selectedArea.length >= 3) {
      L.polygon(selectedArea, {
        color: '#286348',
        fillColor: '#54c98a',
        fillOpacity: 0.52,
        opacity: 1,
        weight: 2,
      }).addTo(overlayLayer)
    }

    if (selectedMarker) {
      const markerIcon = L.divIcon({
        className: '!border-0 !bg-transparent',
        html: '<i class="pi pi-map-marker text-[24px] text-red-600 drop-shadow-md"></i>',
        iconSize: [42, 56],
        iconAnchor: [21, 56],
      })

      L.marker([selectedMarker.latitude, selectedMarker.longitude], {
        icon: markerIcon,
        title: selectedMarker.label,
      }).addTo(overlayLayer)
    }
  }, [selectedArea, selectedMarker])

  return (
    <div
      ref={mapContainerRef}
      className={`h-full w-full ${className}`}
    />
  )
}
