import { hash } from '../utils/hash.ts';
import { createPoint } from './geojson.point.ts';
import { createMultiPoint } from './geojson.multiPoint.ts';
import { createLineString } from './geojson.lineString.ts';

export * from './domain.ts';
export * from './geojson.guards.ts';

export const point = createPoint({ hash });
export const multiPoint = createMultiPoint({ hash });
export const lineString = createLineString({ hash });
