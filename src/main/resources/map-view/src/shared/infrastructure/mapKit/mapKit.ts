import React from 'react';
import MapboxGL from 'mapbox-gl';
import { createComponent } from './mapKit.component.tsx';
import { shapeId } from './mapKit.config.ts';
import { useFeaturePopup } from './mapKit.store.ts';
import { createInitialize } from './mapKit.initialize.ts';
import { GeoJSON } from 'geojson';

MapboxGL.accessToken =
  'pk.eyJ1IjoiY3J5c3AiLCJhIjoiY201Z2hheHNnMDh4eTJpc2RpMzQ5eHRrMSJ9.aD-skkpX3F0dLPp7tCjqjQ';

export const createMap = (
  initialShape: Nullable<GeoJSON>,
  postInitialize: (map: MapboxGL.Map) => void,
) => {
  const ref = React.createRef<MapboxGL.Map>();
  const initialize = createInitialize({
    initialShape,
    postInitialize,
    shapeId,
  });
  const component = createComponent({
    ref,
    initialize: initialize.instanceInitialization,
    useFeaturePopup,
  });

  return {
    Component: component,
    setShape: initialize.setShape,
  };
};
