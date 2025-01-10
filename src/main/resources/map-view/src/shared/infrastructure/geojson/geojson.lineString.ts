import type { Feature, GeoJsonProperties, LineString } from 'geojson';
import type { LKGeoJSONFeature } from '../../kernel';

type Dependencies = {
  hash: (source: string) => string;
};

export const createLineString =
  ({ hash }: Dependencies) =>
  <P = GeoJsonProperties>(
    feature: Feature<LineString, P>,
  ): LKGeoJSONFeature<LineString, P> => ({
    __key: hash(JSON.stringify(feature.geometry.coordinates)),
    ...feature,
  });
