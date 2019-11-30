function createFeatures(earthquakeData) {

    // Define a function we want to run once for each feature in the features array
    // Give each feature a popup describing the place and time of the earthquake
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>" + feature.properties.place + "<br>Magnitude: " + feature.properties.mag +
        "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");

    }

    function pointToLayer(feature, latlng) {
        
        function fillColor(feature) {
            if (feature.properties.mag <= 1) { return "#A2EC00" } else
            if (feature.properties.mag <= 2) { return "#ACDA00" } else
            if (feature.properties.mag <= 3) { return "#B5C700" } else
            if (feature.properties.mag <= 4) { return "#BEB500" } else
            if (feature.properties.mag <= 5) { return "#C7A200" } else
            if (feature.properties.mag <= 6) { return "#D19000" } else
            if (feature.properties.mag <= 7) { return "#DA7D00" } else
            if (feature.properties.mag <= 8) { return "#E36B00" } else
            if (feature.properties.mag > 9) { return "#EC5800" } else
            { return "#F64600" }
        }

        function setRad(feature) {
            if (feature.properties.mag <= 1) { return 3 } else
            if (feature.properties.mag <= 2) { return 6 } else
            if (feature.properties.mag <= 3) { return 9 } else
            if (feature.properties.mag <= 4) { return 12 } else
            if (feature.properties.mag <= 5) { return 14 } else
            if (feature.properties.mag <= 6) { return 16 } else
            if (feature.properties.mag <= 7) { return 18 } else
            if (feature.properties.mag <= 8) { return 20 } else
            if (feature.properties.mag > 9) { return 21 } else
            { return 22 }
        }
        
        var geojsonMarkerOptions = {
            radius: setRad(feature),
            fillColor: fillColor(feature),
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        };


        return L.circleMarker(latlng, geojsonMarkerOptions)
    }
    // Create a GeoJSON layer containing the features array on the earthquakeData object
    // Run the onEachFeature function once for each piece of data in the array
    const earthquakes = L.geoJSON(earthquakeData, {
        onEachFeature: onEachFeature,
        pointToLayer: pointToLayer
    });

    
    createMap(earthquakes);
}

function createMap(earthquakes) {

    // Define streetmap and darkmap layers
    const streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.streets",
            accessToken: API_KEY
    });

    const darkmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
            attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
            maxZoom: 18,
            id: "mapbox.dark",
            accessToken: API_KEY
    });

    // Define a baseMaps object to hold our base layers
    const baseMaps = {
            "Street Map": streetmap,
            "Dark Map": darkmap
    };

    // Create overlay object to hold our overlay layer
    const overlayMaps = {
            Earthquakes: earthquakes
    };

    // Create our map, giving it the streetmap and earthquakes layers to display on load
    const myMap = L.map("map", {
            center: [37.09, -95.71],
            zoom: 5,
            layers: [streetmap, earthquakes]
    });

    // Create a layer control
    // Pass in our baseMaps and overlayMaps
    // Add the layer control to the map
    L.control.layers(baseMaps, overlayMaps, {
            collapsed: false
    }).addTo(myMap);

    const info = L.control({
        position: "bottomright"
    });
    
    // When the layer control is added, insert a div with the class of "legend"
    info.onAdd = function() {
        const div = L.DomUtil.create("div", "legend");
        return div;
    };

    info.addTo(myMap);

}

(async function(){
    const P7A_url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";
    const response = await d3.json(P7A_url);
    // Once we get a response, send the data.features object to the createFeatures function
    createFeatures(response.features);

    const colorarray = [
         "#A2EC00", 
         "#ACDA00",
         "#B5C700",
         "#BEB500",
         "#C7A200",
         "#D19000",
         "#DA7D00",
         "#E36B00",
         "#EC5800",
         "#F64600" 
    ]

    const legendarray = [
        "0-1",
        "1-2",
        "2-3",
        "3-4",
        "4-5",
        "5-6",
        "6-7",
        "7-8",
        "8-9",
        "9+"
    ]

    const legdiv = document.querySelector(".legend");
   
    legdiv.innerHTML += "<h5>Magnitudes</h5>"
    for (var i = 0; i < 10; i++) {
        legdiv.innerHTML += `<div class="square" style="background-color: ${colorarray[i]};"></div>${legendarray[i]}<br>`;
    }
    // Add the info legend to the map
    
})()
