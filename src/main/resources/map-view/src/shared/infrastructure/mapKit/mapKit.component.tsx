import React, { useEffect, useRef } from 'react';
import MapboxGL from 'mapbox-gl';
import { area, length } from '@turf/turf';
import { MKFeatureAnchor, MKInitializeMap } from './types.ts';
import {
  Feature,
  LineString,
  MultiPoint,
  MultiPolygon,
  MultiLineString,
  Point,
  Polygon,
} from 'geojson';
import { isNull } from 'lodash';

type Dependencies = {
  ref: React.MutableRefObject<MapboxGL.Map | null>;
  initialize: MKInitializeMap;
  useFeaturePopup: () => Nullable<MKFeatureAnchor>;
};

type Props = React.HTMLAttributes<HTMLDivElement>;

export const createComponent = ({
  ref,
  initialize,
  useFeaturePopup,
}: Dependencies): React.FC<Props> => {
  return (props) => {
    const container = useRef(null);
    const popover = useRef<MapboxGL.Popup>(
      new MapboxGL.Popup({ className: 'popover' }),
    );
    const popup = useFeaturePopup();

    useEffect(() => {
      if (ref.current || !container.current) {
        return;
      }

      const { instance } = initialize(container.current);
      ref.current = instance;
    }, []);

    useEffect(() => {
      if (!ref.current) {
        return;
      }

      if (popup) {
        popover.current.setLngLat(popup.coordinate);
        popover.current.setHTML(featurePropertiesToHtml(popup.feature));
        popover.current.addTo(ref.current);
      } else {
        popover.current.remove();
      }
    }, [popup]);

    return <div ref={container} id="map" {...props} />;
  };
};

function featurePropertiesToHtml(feature: Feature) {
  if (isPointFeature(feature) || isMultiPointFeature(feature)) {
    return pointPropertiesToHtml(feature);
  }
  if (isPolygonFeature(feature) || isMultiPolygonFeature(feature)) {
    return polygonPropertiesToHtml(feature);
  }
  if (isLineStringFeature(feature) || isMultiLineStringFeature(feature)) {
    return lineStringPropertiesToHtml(feature);
  }
  return feature.geometry.type;
}

function isPointFeature(feature: Feature): feature is Feature<Point> {
  return feature.geometry.type === 'Point';
}

function isMultiPointFeature(feature: Feature): feature is Feature<MultiPoint> {
  return feature.geometry.type === 'MultiPoint';
}

function isPolygonFeature(feature: Feature): feature is Feature<Polygon> {
  return feature.geometry.type === 'Polygon';
}

function isMultiPolygonFeature(
  feature: Feature,
): feature is Feature<MultiPolygon> {
  return feature.geometry.type === 'MultiPolygon';
}

function isLineStringFeature(feature: Feature): feature is Feature<LineString> {
  return feature.geometry.type === 'LineString';
}

function isMultiLineStringFeature(
  feature: Feature,
): feature is Feature<MultiLineString> {
  return feature.geometry.type === 'MultiLineString';
}

function pointPropertiesToHtml(feature: Feature<Point | MultiPoint>) {
  const [lon, lat] = feature.geometry.coordinates;

  if (feature.properties) {
    return `<div class="popover-header">${lon}, ${lat}</div><div class="popover-main">${objectToHtml(feature.properties)}</div>`;
  }

  return `<div class="popover-header">${lon}, ${lat}</div>`;
}

function polygonPropertiesToHtml(feature: Feature<Polygon | MultiPolygon>) {
  let square = area(feature);
  let unit = 'm';

  if (square > 1000000) {
    square = Math.round(square / 1000000);
    unit = 'km';
  } else {
    square = Math.round(square);
  }

  if (feature.properties && Object.keys(feature.properties).length > 0) {
    return `<div class="popover-header">${square} ${unit}<sup>2</sup></div><div class="popover-main">${objectToHtml(feature.properties)}</div>`;
  }

  return `<div class="popover-header">${square} ${unit}<sup>2</sup></div>`;
}

function lineStringPropertiesToHtml(
  feature: Feature<LineString | MultiLineString>,
) {
  let len = length(feature, { units: 'centimeters' });
  let distance = len.toFixed(2);
  let unit = 'cm';

  if (len > 100000) {
    distance = (len / 100000).toFixed(2);
    unit = 'km';
  } else if (len > 100) {
    distance = (len / 100).toFixed(2);
    unit = 'm';
  }

  if (feature.properties && Object.keys(feature.properties).length > 0) {
    return `<div class="popover-header">${distance} ${unit}</div><div class="popover-main">${objectToHtml(feature.properties)}</div>`;
  }

  return `<div class="popover-header">${distance} ${unit}</div>`;
}

function objectToHtml(object: Record<string, any>) {
  const lines: string[] = [];

  for (const [key, value] of Object.entries(object)) {
    if (isNull(value)) {
      lines.push(
        `<li><span class="property-key">${key}:</span><span class="property-value">null</span></li>`,
      );
      continue;
    }
    switch (typeof value) {
      case 'object':
        if (Array.isArray(value)) {
          lines.push(
            `<li><span class="property-key">${key}:</span><span class="property-value">${arrayToHtml(value)}</span></li>`,
          );
        } else {
          lines.push(
            `<li><span class="property-key">${key}:</span><span class="property-value">${objectToHtml(value)}</span></li>`,
          );
        }
        break;
      case 'bigint':
      case 'boolean':
      case 'string':
      case 'symbol':
      case 'number':
        lines.push(
          `<li><span class="property-key">${key}:</span><span class="property-value">${value.toString()}</span></li>`,
        );
        break;
      default:
        lines.push(
          `<li><span class="property-key">${key}:</span><span class="property-value"></span></li>`,
        );
    }
  }

  return `<ul>${lines.join('')}</ul>`;
}

function arrayToHtml(array: any[]) {
  return array.map((item) => JSON.stringify(item)).join(', ');
}
