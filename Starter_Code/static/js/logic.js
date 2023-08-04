
// let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_week.geojson";
let queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson"

d3.json(queryUrl).then(function (data) {
 
  createFeatures(data.features);

});

function colorCalculator(depth) {
  switch (true) {
    case depth > 350:
      return "#1a0000";
    case depth > 300:
      return "#4d0000";
    case depth > 250:
      return "#990000";
    case depth > 200:
      return "#cc0000";
    case depth > 150:
      return "#ff0000";
    case depth > 100:
      return "#ff3333";
    case depth > 50:
      return "#ff6666";
    default:
      return "#ffb3b3";
  }
}

function markerSize(magnitude) {
  if (magnitude === 0) {
    return 1;
  }

  return magnitude *2;
}


function createFeatures(earthquakeData) {


  let earthquakes = L.geoJSON(earthquakeData, {

    pointToLayer: function (geoJsonPoint, latlng) {
      return L.circleMarker(latlng);},

    style: function (geoJsonFeature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: colorCalculator(geoJsonFeature.geometry.coordinates[2]),
        radius: markerSize(geoJsonFeature.properties.mag),
        weight: 0.5,
        color: "black"
      };
    },
    
    onEachFeature: function (feature, layer){
      layer.bindPopup(`<h3>Location:${feature.properties.place}</h3><hr><p>Date:${new Date(feature.properties.time)}
      </p><hr><p>Magnitude:${feature.properties.mag}</p><hr><p>Depth:${feature.geometry.coordinates[2]}</p>`);}

});

  createMap(earthquakes);
}
  
  function createMap(earthquakes) {
  
    // Create the base layers.
    let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    })
  
    let topo = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
    });
  
    // Create a baseMaps object.
    let baseMaps = {
      "Street Map": street,
      "Topographic Map": topo
    };
  
    // Create an overlay object to hold our overlay.
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    // Create our map, giving it the streetmap and earthquakes layers to display on load.
    let myMap = L.map("map", {
      center: [
        0, 0
      ],
      zoom: 2.5,
      layers: [street, earthquakes]
    });
  
    // Create a layer control.
    // Pass it our baseMaps and overlayMaps.
    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  }

//   }


 //     for (let i = 0; i < feature.length; i++) {
    //         L.circle(features[i].geometry.coordinates[0,1], {
    //             fillOpacity: 1,
    //             color: "black",
    //             fillColor: features[i].geometry.coordinates[2],
    //             radius: markerSize(features[i].properties.mag)
    // })