import React, { useEffect, useRef } from 'react';
import * as maplibreglModule from 'maplibre-gl';
import type { VillageThreat } from '../types';
import { HOOGHLY_BBOX } from '../mockData';

// Compatible import for Vite ESM bundler
const maplibregl = (maplibreglModule as any).default || maplibreglModule;

interface MapComponentProps {
  villages: VillageThreat[];
  selectedVillage: VillageThreat | null;
  onSelectVillage: (village: VillageThreat) => void;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  villages,
  selectedVillage,
  onSelectVillage
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Initialize MapLibre Map instance
    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://basemaps.cartocdn.com/gl/positron-gl-style/style.json',
      center: [87.9, 22.8],
      zoom: 9.5,
      pitch: 0
    });

    map.addControl(new maplibregl.NavigationControl(), 'top-right');
    map.addControl(new maplibregl.ScaleControl(), 'bottom-left');

    map.on('load', () => {
      // Add Hooghly Basin bounding box outline layer
      map.addSource('hooghly-bbox', {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: { name: 'Hooghly Basin Sector' },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [HOOGHLY_BBOX[0], HOOGHLY_BBOX[1]],
                [HOOGHLY_BBOX[2], HOOGHLY_BBOX[1]],
                [HOOGHLY_BBOX[2], HOOGHLY_BBOX[3]],
                [HOOGHLY_BBOX[0], HOOGHLY_BBOX[3]],
                [HOOGHLY_BBOX[0], HOOGHLY_BBOX[1]]
              ]
            ]
          }
        }
      });

      map.addLayer({
        id: 'hooghly-bbox-fill',
        type: 'fill',
        source: 'hooghly-bbox',
        paint: {
          'fill-color': '#003366',
          'fill-opacity': 0.08
        }
      });

      map.addLayer({
        id: 'hooghly-bbox-line',
        type: 'line',
        source: 'hooghly-bbox',
        paint: {
          'line-color': '#003366',
          'line-width': 3,
          'line-dasharray': [2, 1]
        }
      });
    });

    mapRef.current = map;

    return () => {
      map.remove();
    };
  }, []);

  // Update Markers when villages change or selectedVillage changes
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    // Remove old markers
    Object.values(markersRef.current).forEach((marker: any) => marker.remove());
    markersRef.current = {};

    villages.forEach((village) => {
      const isSelected = selectedVillage?.id === village.id;
      const isCritical = village.threatLevel === 'CRITICAL';
      const isHigh = village.threatLevel === 'HIGH';

      const colorClass = isCritical
        ? 'bg-red-700 border-red-950 text-white'
        : isHigh
        ? 'bg-amber-600 border-amber-950 text-white'
        : 'bg-blue-700 border-blue-950 text-white';

      const el = document.createElement('div');
      el.className = `cursor-pointer transition-all duration-200 transform ${
        isSelected ? 'scale-125 z-50 ring-4 ring-black' : 'hover:scale-110 z-10'
      }`;

      el.innerHTML = `
        <div class="flex flex-col items-center">
          <div class="${colorClass} px-2 py-1 text-xs font-black rounded-none border-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wider flex items-center space-x-1">
            ${isCritical ? '<span class="w-2 h-2 rounded-full bg-white animate-ping mr-1"></span>' : ''}
            <span>${village.name}</span>
          </div>
          <div class="w-3 h-3 ${colorClass} rotate-45 -mt-1 border-b-2 border-r-2 border-black"></div>
        </div>
      `;

      el.addEventListener('click', () => {
        onSelectVillage(village);
        map.flyTo({
          center: [village.lng, village.lat],
          zoom: 11,
          duration: 1200
        });
      });

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([village.lng, village.lat])
        .addTo(map);

      markersRef.current[village.id] = marker;
    });
  }, [villages, selectedVillage, onSelectVillage]);

  return (
    <div className="relative w-full h-full bg-slate-200">
      {/* Map Container Canvas */}
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Map Header Overlay Banner */}
      <div className="absolute top-3 left-4 z-20 bg-blue-900 text-white border-2 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
        <h2 className="text-xs font-black uppercase tracking-widest text-blue-200">
          GIS Sector Surveillance Canvas
        </h2>
        <p className="text-sm font-bold tracking-tight">
          SECTOR: HOOGHLY BASIN [87.5°E - 88.5°E | 22.5°N - 23.5°N]
        </p>
      </div>

      {/* Legend Box */}
      <div className="absolute bottom-6 right-4 z-20 bg-white border-2 border-black p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="text-xs font-black text-slate-900 border-b-2 border-slate-900 pb-1 mb-2 uppercase">
          Threat Classification
        </div>
        <div className="flex flex-col space-y-1.5 text-xs font-bold text-slate-900">
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-red-700 border border-black inline-block"></span>
            <span>CRITICAL (&gt;80% SAR Inundation)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-amber-600 border border-black inline-block"></span>
            <span>HIGH (50% - 80% Inundation)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-4 h-4 bg-blue-700 border border-black inline-block"></span>
            <span>MODERATE (&lt;50% Inundation)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
