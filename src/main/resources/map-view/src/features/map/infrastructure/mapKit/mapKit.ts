import MapboxGL from 'mapbox-gl';
import { createMap } from '../../../../shared/infrastructure/mapKit/mapKit.ts';

const mapKit = createMap(null, (map) => {
  map.addControl(new MapboxGL.NavigationControl());
});

export const MapView = mapKit.Component;
export const setShape = mapKit.setShape;
