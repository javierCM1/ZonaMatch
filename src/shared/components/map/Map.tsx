import { useEffect, useRef } from 'react'
import type { LatLngBoundsExpression, Map as LeafletMap } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapMarker {
  id: string
  latitude: number
  longitude: number
  color?: string
  selected?: boolean
  label?: string
}

export interface MapProps {
  markers?: MapMarker[]
  className?: string
  onMarkerSelect?: (marker: MapMarker) => void
}

const CABA_CENTER: [number, number] = [-34.6037, -58.3816]
const AMBA_BOUNDS: LatLngBoundsExpression = [
  [-35.2, -59.4],
  [-34.25, -58.0],
]

export function Map({ markers = [], className = '', onMarkerSelect }: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)

  useEffect(() => {
    if (!containerRef.current || mapRef.current) {
      return
    }

    const map = L.map(containerRef.current, {
      center: CABA_CENTER,
      zoom: 12,
      minZoom: 10,
      maxZoom: 17,
      maxBounds: AMBA_BOUNDS,
      maxBoundsViscosity: 1,
      zoomControl: false,
    })

    L.control.zoom({ position: 'bottomright' }).addTo(map)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)

    mapRef.current = map
    markersLayerRef.current = L.layerGroup().addTo(map)

    return () => {
      map.remove()
      mapRef.current = null
      markersLayerRef.current = null
    }
  }, [])

  useEffect(() => {
    const layer = markersLayerRef.current

    if (!layer) {
      return
    }

    layer.clearLayers()

    markers.forEach((marker) => {
      const circle = L.circleMarker([marker.latitude, marker.longitude], {
        radius: marker.selected ? 11 : 8,
        color: '#ffffff',
        weight: marker.selected ? 4 : 3,
        fillColor: marker.color ?? '#059669',
        fillOpacity: 1,
      })

      if (marker.label) {
        circle.bindTooltip(marker.label, { direction: 'top', offset: [0, -8] })
      }

      circle.on('click', () => onMarkerSelect?.(marker))
      circle.addTo(layer)
    })
  }, [markers, onMarkerSelect])

  return <div ref={containerRef} className={`h-full w-full ${className}`} />
}