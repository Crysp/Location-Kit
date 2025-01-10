import type { Feature, GeoJsonProperties, Point } from 'geojson';
import type { LKGeoJSONFeature } from '../../kernel';

type Dependencies = {
  hash: (source: string) => string;
};

export const createPoint =
  ({ hash }: Dependencies) =>
  <P = GeoJsonProperties>(
    feature: Feature<Point, P>,
  ): LKGeoJSONFeature<Point, P> => ({
    __key: hash(JSON.stringify(feature.geometry.coordinates)),
    ...feature,
  });
