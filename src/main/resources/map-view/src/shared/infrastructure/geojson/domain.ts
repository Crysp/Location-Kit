import type { Feature, FeatureCollection, GeometryCollection } from 'geojson';
import crypto from 'crypto-js';
import type {
  LKGeoJSONFeature,
  LKGeoJSONFeatureCollection,
} from '../../kernel';

const geometryCollectionHash = (
  source: GeometryCollection,
  stored: string = '',
): string => {
  let res = stored;

  for (const geometry of source.geometries) {
    if (geometry.type === 'GeometryCollection') {
      res += geometryCollectionHash(geometry, res);
    } else {
      res += JSON.stringify(geometry.coordinates);
    }
  }

  return crypto.MD5(res).toString();
};

export const toLKGeoJSONFeature = (dto: Feature): LKGeoJSONFeature => {
  if (dto.geometry.type === 'GeometryCollection') {
    return {
      ...dto,
      id:
        typeof dto.id === 'undefined'
          ? geometryCollectionHash(dto.geometry)
          : dto.id.toString(),
    };
  }
  return {
    ...dto,
    id:
      typeof dto.id === 'undefined'
        ? crypto.MD5(JSON.stringify(dto.geometry.coordinates)).toString()
        : dto.id.toString(),
  };
};

export const toLKGeoJSONFeatureCollection = (
  dto: FeatureCollection,
): LKGeoJSONFeatureCollection => ({
  ...dto,
  features: dto.features.map(toLKGeoJSONFeature),
});
