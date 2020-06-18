// Create the tile layer that will be the background of our map
var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
  maxZoom: 18,
  id: "outdoors-v11",
  accessToken: API_KEY
});

// Initialize all of the LayerGroups we'll be using
var layers = {
  GOOD: new L.LayerGroup(),
  MODERATE: new L.LayerGroup(),
  UNHEALTHY: new L.LayerGroup(),
  VERY_UNHEALTHY: new L.LayerGroup(),
  HAZARDOUS: new L.LayerGroup()
};

// Create the map with our layers
var map = L.map("map", {
  center: [43.6532, -79.3832],
  zoom: 3,
  layers: [
    layers.GOOD,
    layers.MODERATE,
    layers.UNHEALTHY,
    layers.VERY_UNHEALTHY,
    layers.HAZARDOUS
  ]
});

// Add our 'lightmap' tile layer to the map
lightmap.addTo(map);

// Create an overlays object to add to the layer control
var overlays = {
  "Good": layers.GOOD,
  "Moderate": layers.MODERATE,
  "Unhealthy": layers.UNHEALTHY,
  "Very Unhealthy": layers.VERY_UNHEALTHY,
  "Hazardous": layers.HAZARDOUS
};

// Create a control for our layers, add our overlay layers to it
L.control.layers(null, overlays).addTo(map);

// Create a legend to display information about our map
var info = L.control({
  position: "bottomright"
});

// When the layer control is added, insert a div with the class of "legend"
info.onAdd = function() {
  var div = L.DomUtil.create("div", "legend");
  return div;
};

// Add the info legend to the map
info.addTo(map);

// Initialize an object containing icons for each layer group
var icons = {
  GOOD: L.ExtraMarkers.icon({
    icon: 'ion-happy',
    iconColor: "yellow",
    markerColor: "blue",
    shape: "star"
  }),
  MODERATE: L.ExtraMarkers.icon({
    icon: "ion-plus",
    iconColor: "blue",
    markerColor: "green",
    shape: "circle"
  }),
  UNHEALTHY: L.ExtraMarkers.icon({
    icon: "ion-plus",
    iconColor: "green",
    markerColor: "yellow",
    shape: "circle"
  }),
  VERY_UNHEALTHY: L.ExtraMarkers.icon({
    icon: "ion-minus",
    iconColor: "yellow",
    markerColor: "orange",
    shape: "circle"
  }),
  HAZARDOUS: L.ExtraMarkers.icon({
    icon: "ion-nuclear",
    iconColor: "orange",
    markerColor: "red",
    shape: "square"
  })
};

// Perform a call to the get the required data through d3
d3.json("./static/js/data.json", function(data) {

  // Select only the values which have status as "success"
  var tableData=[]
  data.forEach( x=> {
    if (x.status === 'success'){
      tableData.push(x);
    };
  });
  // Select only the array where the required information is present  
  var dataY=[];
  tableData.forEach(function(element) {
      dataY.push(element.data);
  });

  // Checking elements of the required polluion data
  var elements = Object.keys(dataY[0].current.pollution)
  .filter(function(d){
    return ((d != "ts") & (d != "maincn") & (d != "mainus"));
  });

  // Cleaning data of the values which have no pollution parammeter
  var current = dataY.filter(function(d){return d.current.pollution != null;});

  // Create an object to keep of the number of markers in each layer
  var aqiCount = {
    GOOD: 0,
    MODERATE: 0,
    UNHEALTHY: 0,
    VERY_UNHEALTHY: 0,
    HAZARDOUS: 0
  };

  current.forEach(function(d) {
    d.location = d.location;
    d.current.pollution.aqius = +d.current.pollution.aqius;
    
    if (d.current.pollution.aqius <= 15) {
      aqiStatusCode = "GOOD";
    }
    else if (d.current.pollution.aqius <= 31) {
      aqiStatusCode = "MODERATE";
    }
    else if (d.current.pollution.aqius <= 49) {
      aqiStatusCode = "UNHEALTHY";
    }
    else if (d.current.pollution.aqius <= 99) {
      aqiStatusCode = "VERY_UNHEALTHY";
    }
    else {
      aqiStatusCode = "HAZARDOUS";
    }

    // Update the aqi count
    aqiCount[aqiStatusCode]++;

    // console.log(icons['MODERATE'])
    var newMarker = L.marker([d.location.coordinates[1], d.location.coordinates[0]], {
      icon: icons[aqiStatusCode]
    });

      //   // Create a new marker with the appropriate icon and coordinates
  //   // Add the new marker to the appropriate layer
  newMarker.addTo(layers[aqiStatusCode]);

  // Bind a popup to the marker that will  display on click. This will be rendered as HTML
  newMarker.bindPopup(d.city + "," + d.country+ "<br> AQI: " + d.current.pollution.aqius + "<br>" + "AQI Status :"+ aqiStatusCode);
  });
  // Call the updateLegend function, which will... update the legend!
  // updateLegend(aqiCount);


  function getColor(d) {
    return d > 1000  ? 'red' :
           d > 99  ? 'red' :
           d > 49  ? 'orange' :
           d > 31   ? 'yellow' :
           d > 15   ? 'green' :
           d > 0   ? 'blue' :
                      'blue';
}


  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend'),
        grades = [0, 15, 31, 49, 99, 1000],
        labels = [aqiStatusCode];

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);
});

