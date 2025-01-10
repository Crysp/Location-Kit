import MapboxGL from 'mapbox-gl';
import { Feature } from 'geojson';
import { LonLat } from '../../kernel';

export type MKInitializeMap = (container: HTMLElement) => {
  instance: MapboxGL.Map;
  onPointerMove: (handler: (x: number, y: number) => void) => () => void;
};
export type MKFeatureAnchor = {
  coordinate: LonLat;
  feature: Feature;
};

export type MKState = {
  selectedFeature: Nullable<MKFeatureAnchor>;
};
