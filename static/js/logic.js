function createmap(eqplot) {

    // Create the tile layer that will be the background of our map
    var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
        attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
        maxZoom: 18,
        id: "mapbox.streets",
        accessToken: API_KEY
    });

    var myMap = L.map("map", {
        center: [39.8097, -98.5556],
        zoom: 4,
        layers: [streetmap, eqplot]
    });

    var legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend");
        var legendRange = ['0-1','1-2','2-3','3-4','4-5','5+'];
        var legendColor = ['#34ae00','#ccdb32','#e8e238','#3ddbe3','#f0660a','#f0280a'];
        var labels = [];
    
        var legendInfo = "<div class=\"labels\"></div>";
    
        div.innerHTML = legendInfo;
           
        legendRange.forEach(function(limit, index) {
          labels.push("<p style=\"background-color: " + legendColor[index] + "\">" + legendRange[index] + "</p>");
        });
    
        div.innerHTML += "<ul>" + labels.join("") + "</ul>";
        return div;
      };
      legend.addTo(myMap);
};

function createMarkers(response) {
    var eqFeature = response.features;
    var eqMarkers = [];

    console.log(eqFeature);

    for (var index = 0; index < eqFeature.length; index++) {
        var eqIndex = eqFeature[index];
        var geometry = eqIndex.geometry;
        var magLevel = eqIndex.properties.mag;
        var lat = eqIndex.geometry.coordinates[1];
        var lon = eqIndex.geometry.coordinates[0];
        var unknown = eqIndex.geometry.coordinates[2];
        var title = eqIndex.properties.title;
        var info = eqIndex.properties.url;
        var color = "";

        console.log(eqIndex);
        console.log(geometry);
        console.log(magLevel);
        console.log(lat);
        console.log(lon);
        console.log(unknown);
        console.log(title);
        console.log(info);

        if (magLevel < 1) {

            color = "#34ae00";
        }
        else if (magLevel < 2 & magLevel > 1) {
            color = "#ccdb32";
        }
        else if (magLevel < 3 & magLevel > 2) {
            color = "#e8e238";
        }
        else if (magLevel < 4 & magLevel > 3) {
            color = "#3ddbe3";
        }
        else if (magLevel < 5 & magLevel > 4) {
            color = "#f0660a";
        }
        else {
            color = "#f0280a";
        }

        var eqAll = L.circle([lat, lon], {
            fillOpacity: 0.5,
            color: "color",
            fillColor: color,
            radius: magLevel * 30000
        })
            .bindPopup("<h3>" + title + "<h3><h3>Link: " + info +"<h3><h3>Mag: " + magLevel + "<h3>");

        eqMarkers.push(eqAll);
    };
    createmap(L.layerGroup(eqMarkers));
};

var link = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(link, createMarkers);

function updateLegend() {
    var ranges = ['0-1', '1-2', '2-3', '3-4','4-5', '5+'];
    var legendColor = ['#34ae00','#ccdb32','#e8e238','#3ddbe3','#f0660a','#f0280a'];
    for( var i = 0 ; i < ranges.length; i++){
        var layer = ranges[i];
        var color = legendColor[i];
        var ulDiv = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;      
        var value = document.createElement('span');
        value.innerHTML = layer;
        ulDiv.appendChild(key);
        ulDiv.appendChild(value);
        legend.appendChild(ulDiv);
    };
  };