let map;
let cameraPadding = 40;
let userData = {
  type: 'FeatureCollection',
  features: [
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [
              44.48270067876888,
              40.13234627305329
            ],
            [
              44.49161818599609,
              40.1354712593791
            ],
            [
              44.4959400911134,
              40.14230485779001
            ],
            [
              44.497020375344306,
              40.15368012631092
            ],
            [
              44.48404618967939,
              40.159255738317
            ],
            [
              44.47566794239043,
              40.15303469983337
            ],
            [
              44.481617339540804,
              40.14807673629275
            ],
            [
              44.479994024552326,
              40.13855465259684
            ],
            [
              44.48270067876888,
              40.13234627305329
            ]
          ]
        ],
      }
    },
    {
      type: "Feature",
      properties: {},
      geometry: {
        type: "LineString",
        coordinates: [
          [
            44.456709001891056,
            40.15634745825244
          ],
          [
            44.48564979270486,
            40.168154989919515
          ],
          [
            44.49830087217771,
            40.17600700684579
          ],
          [
            44.50128029985592,
            40.17476885411864
          ],
          [
            44.50397795026046,
            40.17807072856601
          ],
          [
            44.51895981259668,
            40.19000402171545
          ],
          [
            44.51378873992829,
            40.19369212282143
          ]
        ],
      }
    },
    {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          44.47563857336351,
          40.172702249749506
        ],
        type: "Point"
      }
    },
    {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          44.49894412000651,
          40.2025088023546
        ],
        type: "Point"
      }
    },
    {
      type: "Feature",
      properties: {},
      geometry: {
        coordinates: [
          44.53549248757935,
          40.17744174755023
        ],
        type: "Point"
      }
    }
  ],
};
userData = undefined;

document.addEventListener('DOMContentLoaded', () => {
  mapboxgl.accessToken = 'pk.eyJ1IjoiY3J5c3AiLCJhIjoiY2pzOHdiejVzMHNhazQzbzFqbXphdWt0MCJ9.T9vmOu3cirdDJi3lnt2qeQ';

  map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/streets-v12',
    projection: 'mercator',
    zoom: 1,
    bounds: userData ? turf.bbox(userData) : undefined,
    fitBoundsOptions: {
      padding: {
        top: cameraPadding,
        right: cameraPadding,
        bottom: cameraPadding,
        left: cameraPadding,
      },
    },
  });

  map.addControl(new mapboxgl.NavigationControl());

  map.on('load', () => {
    map.addSource('user-data', {
      type: 'geojson',
      data: userData,
    });

    map.addLayer({
      id: 'user-style-fill',
      type: 'fill',
      source: 'user-data',
      filter: ['==', ['geometry-type'], 'Polygon'],
      layout: {},
      paint: {
        'fill-color': '#3574F0',
        'fill-opacity': 0.1,
      },
    });

    map.addLayer({
      id: 'user-style-fill-outline',
      type: 'line',
      source: 'user-data',
      filter: ['==', ['geometry-type'], 'Polygon'],
      layout: {
        'line-join': 'round',
      },
      paint: {
        'line-color': '#3574F0',
        'line-width': 2,
        'line-opacity': 0.8,
      },
    });

    map.addLayer({
      id: 'user-style-line',
      type: 'line',
      source: 'user-data',
      filter: ['==', ['geometry-type'], 'LineString'],
      layout: {
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#6B9BFA',
        'line-width': 3,
      }
    });

    map.addLayer({
      id: 'user-style-line-outline',
      type: 'line',
      source: 'user-data',
      filter: ['==', ['geometry-type'], 'LineString'],
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3574F0',
        'line-gap-width': 2.5,
        'line-width': 2,
      }
    });

    map.addLayer({
      id: 'user-style-point',
      type: 'circle',
      source: 'user-data',
      filter: ['==', ['geometry-type'], 'Point'],
      layout: {},
      paint: {
        'circle-color': '#3574F0',
        'circle-stroke-color': '#FFF',
        'circle-stroke-width': 2,
        'circle-radius': 5,
        'circle-emissive-strength': 10,
      }
    });

    map.addLayer({
      id: 'user-style-point-shadow',
      type: 'circle',
      source: 'user-data',
      filter: ['==', ['geometry-type'], 'Point'],
      layout: {},
      paint: {
        'circle-color': '#1E1F22',
        'circle-radius': 20,
        'circle-blur': 3,
        'circle-opacity': 0.8,
      }
    }, 'user-style-point');
  });

  map.on('style.load', () => {
    // cameraFitShape(userData);
  });
});

function zoomIn() {
  if (!map) {
    return;
  }

  map.zoomIn({ duration: 200 });
}

function zoomOut() {
  if (!map) {
    return;
  }

  map.zoomOut({ duration: 200 });
}

function cameraFitShape(shape) {
  if (!map) {
    return;
  }

  const bbox = turf.bbox(shape);

  map.fitBounds(bbox, {
    top: cameraPadding,
    right: cameraPadding,
    bottom: cameraPadding,
    left: cameraPadding,
  }, {
    duration: 200
  });
}

function initialize(data) {
  try {
    userData = JSON.parse(data);

    if (!map) {
      return;
    }

    map.on('load', () => {
      map.getSource('user-data').setData(userData);

      cameraFitShape(userData);
    });
  } catch (error) {
    console.log(error);
  }
}

function setShape(data) {
  try {
    userData = JSON.parse(data);

    if (!map) {
      return;
    }

    map.getSource('user-data').setData(userData);

    cameraFitShape(userData);
  } catch (error) {
    console.log(error);
  }
}
