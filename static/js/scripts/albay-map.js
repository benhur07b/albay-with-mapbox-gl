mapboxgl.accessToken = 'pk.eyJ1Ijoicm9yc2NoYWNoMDdiIiwiYSI6ImNqYjh1NDRwYjBiaGEzM251bWF0a3c1cnAifQ.FEHNJbpxcs_UxuRhKbGF6A';
var map = new mapboxgl.Map({
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [123.4895, 13.126],
    zoom: 10.48,
    bearing: 36.8,
    pitch: 60,
    hash: false,
    container: 'map'
});

var COLORS = ['yellow', 'cyan', 'red', 'magenta'],
    BREAKS = [0, 1, 2, 3],
    FILTERUSE;

map.on('load', function() {

    map.addSource('albay-source', {
        type: 'geojson',
        data: 'static/data/GRID-HEX-ALL.geojson'
    });

    map.addLayer({
        'id': 'albay-cells',
        'type': 'fill',
        'source': 'albay-source',
        'paint': {
            'fill-color': {
                property: 'VAL',
                stops: [
                    [BREAKS[0], COLORS[0]],
                    [BREAKS[1], COLORS[1]],
                    [BREAKS[2], COLORS[2]],
                    [BREAKS[3], COLORS[3]]]
                },
                'fill-opacity': 0.4
            }
    });

    map.addLayer({
        'id': 'albay-cells-hover',
        'type': 'fill',
        'source': 'albay-source',
        'paint': {
            'fill-color': {
                property: 'VAL',
                stops: [
                    [BREAKS[0], COLORS[0]],
                    [BREAKS[1], COLORS[1]],
                    [BREAKS[2], COLORS[2]],
                    [BREAKS[3], COLORS[3]]]
                },
                'fill-opacity': 1
            },
        'filter': ['==', 'VAL', '']
    });

    map.addLayer({
        'id': 'cell-borders',
        'type': 'line',
        'source': 'albay-source',
        'paint': {
            'line-color': 'white',
            'line-width': 0.5,
            'line-opacity': 0.5
            }
    });

    // map.on("mousemove", "albay-cells", function(e) {
    //     map.setFilter("albay-cells-hover", ["==", "CID", e.features[0].properties.CID]);
    // });

    // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    // map.on("mouseleave", "albay-cells", function() {
    //     map.setFilter("albay-cells-hover", ["==", "name", ""]);
    // });

    map.addLayer({
        'id': 'albay-cells-3d',
        'type': 'fill-extrusion',
        'source': 'albay-source',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-extrusion-color': {
                property: 'VAL',
                stops: [
                    [BREAKS[0], COLORS[0]],
                    [BREAKS[1], COLORS[1]],
                    [BREAKS[2], COLORS[2]],
                    [BREAKS[3], COLORS[3]]]
                },
                'fill-extrusion-height': {
                    'property': 'Elev x 3',
                    'type': 'identity'
                },
                'fill-extrusion-opacity': 0.6
            },
    });

    map.addLayer({
        'id': 'albay-cells-3d-hover',
        'type': 'fill-extrusion',
        'source': 'albay-source',
        'layout': {
            'visibility': 'none'
        },
        'paint': {
            'fill-extrusion-color': {
                property: 'VAL',
                stops: [
                    [BREAKS[0], COLORS[0]],
                    [BREAKS[1], COLORS[1]],
                    [BREAKS[2], COLORS[2]],
                    [BREAKS[3], COLORS[3]]]
                },
                'fill-extrusion-height': {
                    'property': 'Elev x 3',
                    'type': 'identity'
                },
                'fill-extrusion-opacity': 1.0
            },
        'filter': ['==', 'VAL', '']
    });
    //
    // map.on("mousemove", "albay-cells-3d", function(e) {
    //     map.setFilter("albay-cells-3d-hover", ["==", "CID", e.features[0].properties.CID]);
    // });
    //
    // // Reset the state-fills-hover layer's filter when the mouse leaves the layer.
    // map.on("mouseleave", "albay-cells-3d", function() {
    //     map.setFilter("albay-cells-3d-hover", ["==", "name", ""]);
    // });

    // Legends
    var layers = ['↑ NDVI and ↑ LST', '↑ NDVI and ↓ LST', '↓ NDVI and ↑ LST', '↓ DNVI and ↓ LST'];
    var colors = ['yellow', 'cyan', 'red', 'magenta'];

    for (i = 0; i < layers.length; i++) {
        var layer = layers[i];
        var color = colors[i];
        var item = document.createElement('div');
        var key = document.createElement('span');
        key.className = 'legend-key';
        key.style.backgroundColor = color;

        var value = document.createElement('span');
        value.innerHTML = layer;
        item.appendChild(key);
        item.appendChild(value);
        legend.appendChild(item);
    }
});

map.getCanvas().style.cursor = 'default';

map.on('mousemove', "albay-cells", function(e) {

    map.setFilter("albay-cells-hover", ["==", "CID", e.features[0].properties.CID]);
    // map.setFilter("albay-cells-3d-hover", ["==", "CID", e.features[0].properties.CID]);

    var states = map.queryRenderedFeatures(e.point, {
    layers: ['albay-cells']
    });

    if (states.length > 0) {
        document.getElementById('pd').innerHTML = '<h3><strong>' + states[0].properties.MUNICITY + '</strong></h3><p>ELEVATION: <strong>' + states[0].properties.Elevation + ' meters </strong></p>' +
        '<p>Change in NDVI: <strong>' + states[0].properties.D_NDVI + '</strong></p>' +
        '<p>Change in LST: <strong>' + states[0].properties.D_LST + ' ° C</strong></p>';
    } else {
        document.getElementById('pd').innerHTML = '<p>Hover over a cell!</p>';
    }
    });

map.on("mouseleave", "albay-cells", function() {
    map.setFilter("albay-cells-hover", ["==", "name", ""]);
    // map.setFilter("albay-cells-3d-hover", ["==", "name", ""]);
});

map.addControl(new mapboxgl.NavigationControl());
