var myMap = L.map("map", {
    center: [43.6532, -79.3832],
    zoom: 3
  });
  
var tileLayer = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  }).addTo(myMap);

function chooseColor(aqi) {
  switch (aqi) {
  case "aqius" < 15:
    return "blue";
  case "aqius" < 31:
    return "green";
  case "aqius" < 49:
    return "yellow";
  case "aqius" < 99:
    return "orange";
  default:
    return "red";
  }
}

d3.json("./static/js/data.json", function(data) {
  
    console.log(data);
  
    var tableData=[]
    data.forEach( x=> {
      if (x.status === 'success'){
        tableData.push(x);
      };
    });
    // console.log(tableData);

    var dataY=[];
    tableData.forEach(function(element) {
        dataY.push(element.data);
    });
    console.log(dataY)

    var heatArray = [];
  
    for (var i = 0; i < dataY.length; i++) {
      var location = dataY[i].location;
 
      if (location) {
        heatArray.push([location.coordinates[1], location.coordinates[0]]);

        L.marker([location.coordinates[1], location.coordinates[0]]).addTo(myMap);
      }
    }

    
    var heat = L.heatLayer(heatArray, {
      max:1.0,
      minOpacity: 0.8,
      radius: 20,
      blur: 10
    }).addTo(myMap);
  
  });
  