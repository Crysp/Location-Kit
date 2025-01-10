import type {
  Feature,
  FeatureCollection,
  GeoJsonProperties,
  Geometry,
} from 'geojson';
import { MapLayerMouseEvent } from 'mapbox-gl';

export type LKGeoJSONFeature<
  G extends Nullable<Geometry> = Geometry,
  P = GeoJsonProperties,
> = Feature<G, P> & {
  id: string;
};
export interface LKGeoJSONFeatureCollection<
  G extends Nullable<Geometry> = Geometry,
  P = GeoJsonProperties,
> extends FeatureCollection<G, P> {
  features: Array<LKGeoJSONFeature<G, P>>;
}
export type LKGeoJSONShape = LKGeoJSONFeature | LKGeoJSONFeatureCollection;

export type GeoBounds = [number, number, number, number];
export type LonLat = [number, number];

export type LKMapLayerMouseEvent = MapLayerMouseEvent & {
  features?: LKGeoJSONFeature[];
};
