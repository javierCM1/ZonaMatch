import { useEffect, useRef } from 'react'
import type { LatLngBoundsExpression, LatLngExpression, Map as LeafletMap } from 'leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export interface MapMarker {
  id: string
  latitude: number
  longitude: number
  color?: string
  selected?: boolean
  label?: string
  /** PrimeIcons class (e.g. "pi-car") drawn inside the marker. Without it the marker is a plain dot. */
  icon?: string
  /** Glyph color over `color`; defaults to white. */
  iconColor?: string
}

/** Ring, rings (outer + holes) or list of polygons, in [lat, lng]. */
export type MapArea = LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][]

const DEFAULT_MARKER_COLOR = '#059669'

function iconMarker(marker: MapMarker): L.Marker {
  const size = marker.selected ? 30 : 22
  const ring = marker.selected ? 3 : 2
  const html = `<span style="display:flex;align-items:center;justify-content:center;width:${size}px;height:${size}px;border-radius:9999px;background:${marker.color ?? DEFAULT_MARKER_COLOR};border:${ring}px solid #fff;box-shadow:0 1px 3px rgba(18,38,31,.35);box-sizing:border-box"><i class="pi ${marker.icon}" style="font-size:${Math.round(size * 0.45)}px;color:${marker.iconColor ?? '#fff'}"></i></span>`

  return L.marker([marker.latitude, marker.longitude], {
    icon: L.divIcon({ className: '', html, iconSize: [size, size], iconAnchor: [size / 2, size / 2] }),
    keyboard: false,
    zIndexOffset: marker.selected ? 1000 : 0,
  })
}

function dotMarker(marker: MapMarker): L.CircleMarker {
  return L.circleMarker([marker.latitude, marker.longitude], {
    radius: marker.selected ? 11 : 8,
    color: '#ffffff',
    weight: marker.selected ? 4 : 3,
    fillColor: marker.color ?? DEFAULT_MARKER_COLOR,
    fillOpacity: 1,
  })
}

export interface MapClickEvent {
  latitude: number
  longitude: number
}

export interface MapCircle {
  latitude: number
  longitude: number
  radiusMeters: number
}

export interface MapProps {
  markers?: MapMarker[]
  /** Polygon overlay, e.g. to highlight an analysis zone. Nested arrays draw holes and multipolygons. */
  selectedArea?: MapArea
  /** Re-centers and zooms the map so `selectedArea` fills the view. */
  fitToArea?: boolean
  className?: string
  onMarkerSelect?: (marker: MapMarker) => void
  /** Fires when clicking the map background (not an existing marker). */
  onMapClick?: (event: MapClickEvent) => void
  /** Search radius drawn over the map (it does not take clicks, so clicking inside it still reaches onMapClick). */
  circle?: MapCircle
}

const CABA_CENTER: [number, number] = [-34.6037, -58.3816]
const AMBA_BOUNDS: LatLngBoundsExpression = [
  [-35.2, -59.4],
  [-34.25, -58.0],
]

export function Map({
  markers = [],
  selectedArea,
  fitToArea = false,
  className = '',
  onMarkerSelect,
  onMapClick,
  circle,
}: MapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LeafletMap | null>(null)
  const circleLayerRef = useRef<L.LayerGroup | null>(null)
  const markersLayerRef = useRef<L.LayerGroup | null>(null)
  const areaLayerRef = useRef<L.LayerGroup | null>(null)
  const onMapClickRef = useRef(onMapClick)
  // Bounds to keep framed while the container settles (only when fitToArea is on)
  const fitBoundsRef = useRef<L.LatLngBounds | null>(null)

  useEffect(() => {
    onMapClickRef.current = onMapClick
  }, [onMapClick])

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

    map.on('click', (event) => {
      onMapClickRef.current?.({ latitude: event.latlng.lat, longitude: event.latlng.lng })
    })

    mapRef.current = map
    areaLayerRef.current = L.layerGroup().addTo(map)
    circleLayerRef.current = L.layerGroup().addTo(map)
    markersLayerRef.current = L.layerGroup().addTo(map)

    // Containers inside dialogs or flex layouts (e.g. the animated sidebar) can change size after mount;
    // re-frame the area so it does not end up off-center.
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize({ pan: false })

      if (fitBoundsRef.current) {
        map.fitBounds(fitBoundsRef.current, { padding: [24, 24], animate: false })
      }
    })
    resizeObserver.observe(containerRef.current)

    return () => {
      resizeObserver.disconnect()
      map.remove()
      mapRef.current = null
      markersLayerRef.current = null
      areaLayerRef.current = null
      circleLayerRef.current = null
    }
  }, [])

  useEffect(() => {
    const layer = areaLayerRef.current

    if (!layer) {
      return
    }

    layer.clearLayers()
    fitBoundsRef.current = null

    if (selectedArea && selectedArea.length > 0) {
      const polygon = L.polygon(selectedArea, {
        color: '#286348',
        fillColor: '#54c98a',
        fillOpacity: 0.35,
        opacity: 1,
        weight: 2,
      }).addTo(layer)

      if (fitToArea) {
        fitBoundsRef.current = polygon.getBounds()
        mapRef.current?.fitBounds(fitBoundsRef.current, { padding: [24, 24] })
      }
    }
  }, [selectedArea, fitToArea])

  useEffect(() => {
    const layer = markersLayerRef.current

    if (!layer) {
      return
    }

    layer.clearLayers()

    markers.forEach((marker) => {
      const leafletMarker = marker.icon ? iconMarker(marker) : dotMarker(marker)

      if (marker.label) {
        leafletMarker.bindTooltip(marker.label, { direction: 'top', offset: [0, -10] })
      }

      leafletMarker.on('click', (event) => {
        L.DomEvent.stopPropagation(event)
        onMarkerSelect?.(marker)
      })
      leafletMarker.addTo(layer)
    })
  }, [markers, onMarkerSelect])

  const circleLatitude = circle?.latitude
  const circleLongitude = circle?.longitude
  const circleRadius = circle?.radiusMeters

  useEffect(() => {
    const layer = circleLayerRef.current

    if (!layer) {
      return
    }

    layer.clearLayers()

    if (circleLatitude === undefined || circleLongitude === undefined || circleRadius === undefined) {
      return
    }

    const center: [number, number] = [circleLatitude, circleLongitude]
    const area = L.circle(center, {
      radius: circleRadius,
      color: '#1f4a38',
      dashArray: '6 6',
      fillColor: '#1f4a38',
      fillOpacity: 0.06,
      interactive: false,
      weight: 2,
    }).addTo(layer)
    L.circleMarker(center, {
      radius: 6,
      color: '#ffffff',
      weight: 3,
      fillColor: '#1f4a38',
      fillOpacity: 1,
      interactive: false,
    }).addTo(layer)

    mapRef.current?.fitBounds(area.getBounds(), { padding: [24, 24], maxZoom: 16 })
  }, [circleLatitude, circleLongitude, circleRadius])

  return <div ref={containerRef} className={`h-full w-full ${className}`} />
}