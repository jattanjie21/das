'use client';

import { useControl } from 'react-map-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

interface DrawControlProps {
  position?: string;
  onCreate?: (evt: { features: any[] }) => void;
  onUpdate?: (evt: { features: any[]; action: string }) => void;
  onDelete?: (evt: { features: any[] }) => void;
}

export function DrawControl(props: DrawControlProps) {
  useControl(
    () => new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    }),
    {
      position: props.position as any,
    },
    {
      onCreate: props.onCreate,
      onUpdate: props.onUpdate,
      onDelete: props.onDelete,
    }
  );

  return null;
} 