const fs = require('fs');
const path = require('path');

fs.readFile(path.join(__dirname, 'countries_2.geojson'), (err, data) => {
  const json = JSON.parse(data.toString());
  const out = {
    type: 'FeatureCollection',
    features: [],
  };
  for (const feature of json.features) {
    if ([
      'NO',
      'SE',
      // 'FI'
    ].includes(feature.properties.ISO_A2)) {
      out.features.push(feature);
    }
  }
  fs.writeFileSync(path.join(__dirname, 'countries_3.geojson'), JSON.stringify(out));
});
