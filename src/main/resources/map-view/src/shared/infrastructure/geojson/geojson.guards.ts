import { LKGeoJSONFeature } from '../../kernel';
import { isFeature } from 'geojson-validation';
import { isNull } from 'lodash';

export const isLKGeoJSONFeature = (
  feature: unknown,
): feature is LKGeoJSONFeature => {
  return (
    isFeature(feature) &&
    typeof feature === 'object' &&
    !isNull(feature) &&
    'id' in feature
  );
};
