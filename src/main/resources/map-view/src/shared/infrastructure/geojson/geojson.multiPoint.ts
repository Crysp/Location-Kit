import type { Feature, GeoJsonProperties, MultiPoint } from 'geojson';
import type { LKGeoJSONFeature } from '../../kernel';

type Dependencies = {
  hash: (source: string) => string;
};

export const createMultiPoint =
  ({ hash }: Dependencies) =>
  <P = GeoJsonProperties>(
    feature: Feature<MultiPoint, P>,
  ): LKGeoJSONFeature<MultiPoint, P> => ({
    __key: hash(JSON.stringify(feature.geometry.coordinates)),
    ...feature,
  });
