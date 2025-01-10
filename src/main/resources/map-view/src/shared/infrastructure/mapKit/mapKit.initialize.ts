import MapboxGL from 'mapbox-gl';
import * as turf from '@turf/turf';
import { MKInitializeMap } from './types.ts';
import { GeoBounds, LonLat } from '../../kernel';
import mitt from 'mitt';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { GeoJsonLayer } from '@deck.gl/layers';
import chroma from 'chroma-js';
import { GeoJSON } from 'geojson';
import { saveSelectedFeature, unselectedFeature } from './mapKit.store.ts';
import { isFeature, valid } from 'geojson-validation';

type Dependencies = {
  initialShape: Nullable<GeoJSON>;
  postInitialize: (map: MapboxGL.Map) => void;
  shapeId: string;
};

export const createInitialize = ({
  initialShape,
  postInitialize,
  shapeId,
}: Dependencies): {
  instanceInitialization: MKInitializeMap;
  initialized: Promise<void>;
  setShape: (data: string) => Promise<void>;
} => {
  const emitter = mitt<{ ready: void; pointer_move: [number, number] }>();
  let instance: Nullable<MapboxGL.Map> = null;
  let overlay: Nullable<MapboxOverlay> = null;
  const initialized = new Promise<void>((resolve) => {
    const handler = () => {
      emitter.off('ready', handler);
      resolve();
    };
    emitter.on('ready', handler);
  });

  function renderLayers(data: GeoJSON, selected: number = -1) {
    const layers = [
      new GeoJsonLayer({
        id: shapeId,
        data,
        pickable: true,
        updateTriggers: {
          getFillColor: [selected],
          getLineColor: [selected],
          getLineWidth: [selected],
          getPointRadius: [selected],
        },
        getFillColor: (feature, objectInfo) => {
          if (['Polygon', 'MultiPolygon'].includes(feature.geometry.type)) {
            if (objectInfo.index === selected) {
              return [...chroma('#8335F0').rgb(), 10];
            }
            return [...chroma('#3574F0').rgb(), 10];
          }

          return chroma('#3574F0').rgb();
        },
        getLineColor: (feature, objectInfo) => {
          if (feature.geometry.type === 'Point') {
            return chroma('#fff').rgb();
          }

          if (objectInfo.index === selected) {
            return chroma('#8335F0').rgb();
          }

          return chroma('#3574F0').rgb();
        },
        getLineWidth: (feature, objectInfo) => {
          if (feature.geometry.type === 'LineString') {
            if (objectInfo.index === selected) {
              return 6;
            }
            return 4;
          }
          if (feature.geometry.type === 'MultiPoint') {
            return 0;
          }
          return 2;
        },
        lineWidthUnits: 'pixels',
        lineCapRounded: true,
        lineJointRounded: true,
        pointRadiusUnits: 'pixels',
        getPointRadius: (feature, { index }) => {
          if (feature.geometry.type === 'Point') {
            if (index === selected) {
              return 7;
            }
            return 5;
          }
          if (feature.geometry.type === 'MultiPoint') {
            if (index === selected) {
              return 4;
            }
            return 3;
          }
          return 5;
        },
        transitions: {
          getFillColor: {
            duration: 150,
            easing: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
          },
          getLineColor: {
            duration: 150,
            easing: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
          },
          getLineWidth: {
            duration: 150,
            easing: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
          },
          getPointRadius: {
            duration: 150,
            easing: (x: number) => -(Math.cos(Math.PI * x) - 1) / 2,
          },
        },
        onHover(pickingInfo) {
          if (pickingInfo.index !== selected) {
            renderLayers(data, pickingInfo.index);
          }
        },
        onClick(pickingInfo) {
          if (isFeature(pickingInfo.object) && pickingInfo.coordinate) {
            let coordinate: LonLat = pickingInfo.coordinate as LonLat;

            if (pickingInfo.object.geometry.type === 'Point') {
              coordinate = pickingInfo.object.geometry.coordinates;
            }

            saveSelectedFeature({
              coordinate,
              feature: pickingInfo.object,
            });
          } else {
            console.warn(
              'Selected object is not a GeoJSON feature',
              pickingInfo.object,
            );
          }
        },
      }),
    ];

    overlay?.setProps({ layers });
  }

  return {
    initialized,
    instanceInitialization: (container) => {
      const _instance = new MapboxGL.Map({
        container,
        style: 'mapbox://styles/mapbox/dark-v11',
        projection: {
          name: 'mercator',
        },
        zoom: 1,
        bounds: initialShape ? bounds(initialShape) ?? undefined : undefined,
        fitBoundsOptions: {
          padding: {
            top: 40,
            right: 40,
            bottom: 40,
            left: 40,
          },
        },
      });

      instance = _instance;

      overlay = new MapboxOverlay({
        getCursor: ({ isHovering }) => {
          if (isHovering) {
            _instance.getCanvas().style.cursor = 'pointer';
          } else {
            _instance.getCanvas().style.cursor = 'grab';
          }
          return 'grab';
        },
        onClick(pickingInfo) {
          if (!pickingInfo.picked) {
            unselectedFeature();
          }
        },
      });

      if (initialShape) {
        renderLayers(initialShape);
      }

      instance.addControl(overlay);

      postInitialize(instance);

      instance.once('style.load', () => {
        emitter.emit('ready');
      });

      return {
        instance,
        onPointerMove: (handler) => {
          const wrapped = ([x, y]: [number, number]) => handler(x, y);

          emitter.on('pointer_move', wrapped);

          return () => {
            emitter.off('pointer_move', wrapped);
          };
        },
      };
    },
    async setShape(data) {
      console.log(data);
      await initialized;

      const shape = JSON.parse(data);
      const validation = valid(shape, true);

      if (!(shape && validation.length === 0)) {
        console.warn('Invalid GeoJSON:', validation);
        return;
      }

      renderLayers(shape);
    },
  };
};

function bounds(shape: GeoJSON): Nullable<GeoBounds> {
  const bbox = turf.bbox(shape);

  return bbox.length === 4 ? bbox : null;
}
