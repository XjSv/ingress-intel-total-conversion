// ==UserScript==
// @id             iitc-plugin-draw-tools@breunigs
// @name           IITC plugin: draw tools
// @category       Layer
// @version        0.6.0.@@DATETIMEVERSION@@
// @namespace      https://github.com/jonatkins/ingress-intel-total-conversion
// @updateURL      @@UPDATEURL@@
// @downloadURL    @@DOWNLOADURL@@
// @description    [@@BUILDNAME@@-@@BUILDDATE@@] Allow drawing things onto the current map so you may plan your next move.
// @include        https://www.ingress.com/intel*
// @include        http://www.ingress.com/intel*
// @match          https://www.ingress.com/intel*
// @match          http://www.ingress.com/intel*
// @grant          none
// ==/UserScript==

@@PLUGINSTART@@

// PLUGIN START ////////////////////////////////////////////////////////


// use own namespace for plugin
window.plugin.drawTools = function() {};

window.plugin.drawTools.loadExternals = function() {
  try { console.log('Loading leaflet.draw JS now'); } catch(e) {}
  @@INCLUDERAW:external/leaflet.draw.js@@
  @@INCLUDERAW:external/spectrum/spectrum.js@@
  try { console.log('done loading leaflet.draw JS'); } catch(e) {}

  window.plugin.drawTools.boot();

  $('head').append('<style>@@INCLUDESTRING:external/leaflet.draw.css@@</style>');
  $('head').append('<style>@@INCLUDESTRING:external/spectrum/spectrum.css@@</style>');
}

window.plugin.drawTools.getMarkerIcon = function(color) {

console.log('getMarkerIcon("' + color + '")');
  if (typeof(color) === "undefined" || color.search(/^[0-9A-Fa-f]{6}$/) == -1) {
    // TODO maybe improve error handling here.
    console.warn('Color is not set or not a valid color. Using default color as fallback.');
    color = "a24ac3";
  }

  // As the length of the color string is 6 charaters which translates to 8 base64 encodes characters
  // and we ensured that the color in the svg template is properly aligned we can construct the
  // resulting base64 encoded svg by replacing the color inside the base64 encoded template!
  var svgIcon = 'data:image/svg+xml;base64,' +
    'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4NCjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIg0KCXZlcnNpb249IjEuMSIgYmFzZVByb2ZpbGU9ImZ1bGwiDQoJd2lkdGg9IjUwcHgiIGhlaWdodD0iODJweCIgdmlld0JveD0iMCAwIDUwIDgyIj4NCg0KCTxwYXRoIGQ9Ik0yLjcyNDgzNjg5NTMsMzcuMzQ5NzYyNDkzNSBBMjUsMjUgMCAxLDEgNDcuMjc1MTYzMTA0NywzNy4zNDk3NjI0OTM1IEwyNSw4MS4wNjcyMzE2MTQ2IFoiIHN0eWxlPSJzdHJva2U6bm9uZTsgICBmaWxsOiAj' +
    btoa(color) +
    'OyIgLz4NCgk8cGF0aCBkPSJNMy42MTU4NDM0MTk1LDM2Ljg5NTc3MTk5MzcgQTI0LDI0IDAgMSwxIDQ2LjM4NDE1NjU4MDUsMzYuODk1NzcxOTkzNyBMMjUsNzguODY0NTQyMzUgWiIgc3R5bGU9InN0cm9rZTojMDAwMDAwOyBzdHJva2Utd2lkdGg6MnB4OyBzdHJva2Utb3BhY2l0eTogMC4xNTsgZmlsbDogbm9uZTsiIC8+DQoJPHBhdGggZD0iTTUuODQzMzU5NzMsMzUuNzYwNzk1NzQ0NCBBMjEuNSwyMS41IDAgMSwxIDQ0LjE1NjY0MDI3LDM1Ljc2MDc5NTc0NDQgTDI1LDczLjM1NzgxOTE4ODYgWiIgc3R5bGU9InN0cm9rZTojZmZmZmZmOyBzdHJva2Utd2lkdGg6M3B4OyBzdHJva2Utb3BhY2l0eTogMC4zNTsgZmlsbDogbm9uZTsiIC8+DQoNCgk8cGF0aCBkPSJNMzkuNzIyNDMxODY0MywzNC41IEwyNSw0MyBMMTAuMjc3NTY4MTM1NywzNC41IEwxMC4yNzc1NjgxMzU3LDE3LjUgTDI1LDkgTDM5LjcyMjQzMTg2NDMsMTcuNSBaIE0xNS40NzM3MjA1NTg0LDIwLjUgTDM0LjUyNjI3OTQ0MTYsMjAuNSBMMjUsMzcgWiBNMjUsMjYgTDE1LjQ3MzcyMDU1ODQsMjAuNSBNMjUsMjYgTDM0LjUyNjI3OTQ0MTYsMjAuNSBNMjUsMjYgTDI1LDM3IE0zOS43MjI0MzE4NjQzLDM0LjUgTDMyLjc5NDIyODYzNDEsMzAuNSBNMTAuMjc3NTY4MTM1NywzNC41IEwxNy4yMDU3NzEzNjU5LDMwLjUgTTI1LDkgTDI1LDE3IiBzdHlsZT0ic3Ryb2tlOiNmZmZmZmY7IHN0cm9rZS13aWR0aDoyLjVweDsgc3Ryb2tlLW9wYWNpdHk6IDE7IGZpbGw6IG5vbmU7IiAvPg0KDQoNCjwvc3ZnPg==';

  // As we have a svg icon, we can use the same icon for the regular and the retina version.
  return L.icon({
    iconUrl: svgIcon,
    iconRetinaUrl: svgIcon,
    iconSize: new L.Point(25, 41),
    iconAnchor: new L.Point(12, 41),
    popupAnchor: new L.Point(1, -34),
    shadowSize: new L.Point(41, 41),
    // L.icon does not use the option color, but we store it here to
    // be able to simply retrieve the color for serializing markers
    color: '#' + color
  });
}

window.plugin.drawTools.currentColor = '#a24ac3';
window.plugin.drawTools.currentMarker = window.plugin.drawTools.getMarkerIcon('a24ac3');

window.plugin.drawTools.setOptions = function() {

  window.plugin.drawTools.lineOptions = {
    stroke: true,
    color: window.plugin.drawTools.currentColor,
    weight: 4,
    opacity: 0.5,
    fill: false,
    clickable: true
  };

  window.plugin.drawTools.polygonOptions = L.extend({}, window.plugin.drawTools.lineOptions, {
    fill: true,
    fillColor: null, // to use the same as 'color' for fill
    fillOpacity: 0.2
  });

  window.plugin.drawTools.editOptions = L.extend({}, window.plugin.drawTools.polygonOptions, {
    dashArray: [10,10]
  });
  delete window.plugin.drawTools.editOptions.color;

  window.plugin.drawTools.markerOptions = {
    icon: window.plugin.drawTools.currentMarker,
    zIndexOffset: 2000
  };

}

window.plugin.drawTools.setDrawColor = function(color) {
  window.plugin.drawTools.currentColor = color;
  window.plugin.drawTools.currentMarker = window.plugin.drawTools.getMarkerIcon(color.substr(1));

  window.plugin.drawTools.drawControl.setDrawingOptions({
    'polygon': { 'shapeOptions': { color: color } },
    'polyline': { 'shapeOptions': { color: color } },
    'circle': { 'shapeOptions': { color: color } },
    'marker': { 'icon': window.plugin.drawTools.currentMarker },
  });
}

// renders the draw control buttons in the top left corner
window.plugin.drawTools.addDrawControl = function() {
  var drawControl = new L.Control.Draw({
    draw: {
      rectangle: false,
      polygon: {
        title: 'Add a polygon\n\n'
          + 'Click on the button, then click on the map to\n'
          + 'define the start of the polygon. Continue clicking\n'
          + 'to draw the line you want. Click the first or last\n'
          + 'point of the line (a small white rectangle) to\n'
          + 'finish. Double clicking also works.',
        shapeOptions: window.plugin.drawTools.polygonOptions,
        snapPoint: window.plugin.drawTools.getSnapLatLng,
      },

      polyline: {
        title: 'Add a (poly) line.\n\n'
          + 'Click on the button, then click on the map to\n'
          + 'define the start of the line. Continue clicking\n'
          + 'to draw the line you want. Click the <b>last</b>\n'
          + 'point of the line (a small white rectangle) to\n'
          + 'finish. Double clicking also works.',
        shapeOptions: window.plugin.drawTools.lineOptions,
        snapPoint: window.plugin.drawTools.getSnapLatLng,
      },

      circle: {
        title: 'Add a circle.\n\n'
          + 'Click on the button, then click-AND-HOLD on the\n'
          + 'map where the circle’s center should be. Move\n'
          + 'the mouse to control the radius. Release the mouse\n'
          + 'to finish.',
        shapeOptions: window.plugin.drawTools.polygonOptions,
        snapPoint: window.plugin.drawTools.getSnapLatLng,
      },

      // Options for marker (icon, zIndexOffset) are not set via shapeOptions,
      // so we have merge them here!
      marker: L.extend({}, window.plugin.drawTools.markerOptions, {
        title: 'Add a marker.\n\n'
          + 'Click on the button, then click on the map where\n'
          + 'you want the marker to appear.',
        snapPoint: window.plugin.drawTools.getSnapLatLng,
        repeatMode: true
      }),

    },

    edit: {
      featureGroup: window.plugin.drawTools.drawnItems,

      edit: {
        title: 'Edit drawn items',
        selectedPathOptions: window.plugin.drawTools.editOptions,
      },

      remove: {
        title: 'Delete drawn items'
      },

    },

  });

  window.plugin.drawTools.drawControl = drawControl;

  map.addControl(drawControl);
//  plugin.drawTools.addCustomButtons();
}


// given a point it tries to find the most suitable portal to
// snap to. It takes the CircleMarker’s radius and weight into account.
// Will return null if nothing to snap to or a LatLng instance.
window.plugin.drawTools.getSnapLatLng = function(unsnappedLatLng) {
  var containerPoint = map.latLngToContainerPoint(unsnappedLatLng);
  var candidates = [];
  $.each(window.portals, function(guid, portal) {
    var ll = portal.getLatLng();
    var pp = map.latLngToContainerPoint(ll);
    var size = portal.options.weight + portal.options.radius;
    var dist = pp.distanceTo(containerPoint);
    if(dist > size) return true;
    candidates.push([dist, ll]);
  });

  if(candidates.length === 0) return unsnappedLatLng;
  candidates = candidates.sort(function(a, b) { return a[0]-b[0]; });
  return candidates[0][1];
}


window.plugin.drawTools.save = function() {
  var data = [];

  window.plugin.drawTools.drawnItems.eachLayer( function(layer) {
    console.log(layer);
    var item = {};
    if (layer instanceof L.GeodesicCircle || layer instanceof L.Circle) {
      item.type = 'circle';
      item.latLng = layer.getLatLng();
      item.radius = layer.getRadius();
      item.color = layer.options.color;
    } else if (layer instanceof L.GeodesicPolygon || layer instanceof L.Polygon) {
      item.type = 'polygon';
      item.latLngs = layer.getLatLngs();
      item.color = layer.options.color;
    } else if (layer instanceof L.GeodesicPolyline || layer instanceof L.Polyline) {
      item.type = 'polyline';
      item.latLngs = layer.getLatLngs();
      item.color = layer.options.color;
    } else if (layer instanceof L.Marker) {
      item.type = 'marker';
      item.latLng = layer.getLatLng();
      item.color = layer.options.icon.options.color;
    } else {
      console.warn('Unknown layer type when saving draw tools layer');
      return; //.eachLayer 'continue'
    }

    data.push(item);
  });

  localStorage['plugin-draw-tools-layer'] = JSON.stringify(data);

  console.log('draw-tools: saved to localStorage');
}

window.plugin.drawTools.load = function() {
  try {
    var dataStr = localStorage['plugin-draw-tools-layer'];
    if (dataStr === undefined) return;

    var data = JSON.parse(dataStr);
    window.plugin.drawTools.import(data);

  } catch(e) {
    console.warn('draw-tools: failed to load data from localStorage: '+e);
  }
}

window.plugin.drawTools.import = function(data) {
  $.each(data, function(index,item) {
    var layer = null;
    var extraOpt = {};
    if (item.color) extraOpt.color = item.color;

    switch(item.type) {
      case 'polyline':
        layer = L.geodesicPolyline(item.latLngs, L.extend({},window.plugin.drawTools.lineOptions,extraOpt));
        break;
      case 'polygon':
        layer = L.geodesicPolygon(item.latLngs, L.extend({},window.plugin.drawTools.polygonOptions,extraOpt));
        break;
      case 'circle':
        layer = L.geodesicCircle(item.latLng, item.radius, L.extend({},window.plugin.drawTools.polygonOptions,extraOpt));
        break;
      case 'marker':
        var extraMarkerOpt = {};
        if (item.color) extraMarkerOpt.icon = window.plugin.drawTools.getMarkerIcon(item.color.substr(1));
        layer = L.marker(item.latLng, L.extend({},window.plugin.drawTools.markerOptions,extraMarkerOpt));
        break;
      default:
        console.warn('unknown layer type "'+item.type+'" when loading draw tools layer');
        break;
    }
    if (layer) {
      window.plugin.drawTools.drawnItems.addLayer(layer);
    }
  });
}


//Draw Tools Options

// Manual import, export and reset data
window.plugin.drawTools.manualOpt = function() {

  var html = '<div class="drawtoolsStyles">'
           + '<input type="color" name="drawColor" id="drawtools_color"></input>'
//TODO: add line style choosers: thickness, maybe dash styles?
           + '</div>'
           + '<div class="drawtoolsSetbox">'
           + '<a onclick="window.plugin.drawTools.optCopy();">Copy/Export Drawn Items</a>'
           + '<a onclick="window.plugin.drawTools.optPaste();return false;">Paste/Import Drawn Items</a>'
           + '<a onclick="window.plugin.drawTools.optReset();return false;">Reset Drawn Items</a>'
           + '</div>';

  dialog({
    html: html,
    dialogClass: 'ui-dialog-drawtoolsSet',
    title: 'Draw Tools Options'
  });

  // need to initialise the 'spectrum' colour picker
  $('#drawtools_color').spectrum({
    flat: false,
    showInput: false,
    showButtons: false,
    showPalette: true,
    showSelectionPalette: false,
    palette: [ ['#a24ac3','#514ac3','#4aa8c3','#51c34a'],
               ['#c1c34a','#c38a4a','#c34a4a','#c34a6f'],
               ['#000000','#666666','#bbbbbb','#ffffff']
    ],
    change: function(color) { window.plugin.drawTools.setDrawColor(color.toHexString()); },
//    move: function(color) { window.plugin.drawTools.setDrawColor(color.toHexString()); },
    color: window.plugin.drawTools.currentColor,
  });
}

window.plugin.drawTools.optAlert = function(message) {
    $('.ui-dialog-drawtoolsSet .ui-dialog-buttonset').prepend('<p class="drawtools-alert" style="float:left;margin-top:4px;">'+message+'</p>');
    $('.drawtools-alert').delay(2500).fadeOut();
}

window.plugin.drawTools.optCopy = function() {
    if (typeof android !== 'undefined' && android && android.shareString) {
        android.shareString(localStorage['plugin-draw-tools-layer']);
    } else {
      dialog({
        html: '<p><a onclick="$(\'.ui-dialog-drawtoolsSet-copy textarea\').select();">Select all</a> and press CTRL+C to copy it.</p><textarea readonly onclick="$(\'.ui-dialog-drawtoolsSet-copy textarea\').select();">'+localStorage['plugin-draw-tools-layer']+'</textarea>',
        width: 600,
        dialogClass: 'ui-dialog-drawtoolsSet-copy',
        title: 'Draw Tools Export'
        });
    }
}

window.plugin.drawTools.optPaste = function() {
  var promptAction = prompt('Press CTRL+V to paste it.', '');
  if(promptAction !== null && promptAction !== '') {
    try {
      var data = JSON.parse(promptAction);
      window.plugin.drawTools.drawnItems.clearLayers();
      window.plugin.drawTools.import(data);
      console.log('DRAWTOOLS: reset and imported drawn tiems');
      window.plugin.drawTools.optAlert('Import Successful.');

      // to write back the data to localStorage
      window.plugin.drawTools.save();
    } catch(e) {
      console.warn('DRAWTOOLS: failed to import data: '+e);
      window.plugin.drawTools.optAlert('<span style="color: #f88">Import failed</span>');
    }

  }
}

window.plugin.drawTools.optReset = function() {
  var promptAction = confirm('All drawn items will be deleted. Are you sure?', '');
  if(promptAction) {
    delete localStorage['plugin-draw-tools-layer'];
    window.plugin.drawTools.drawnItems.clearLayers();
    window.plugin.drawTools.load();
    console.log('DRAWTOOLS: reset all drawn items');
    window.plugin.drawTools.optAlert('Reset Successful. ');
  }
}

window.plugin.drawTools.boot = function() {
  window.plugin.drawTools.setOptions();

  //create a leaflet FeatureGroup to hold drawn items
  window.plugin.drawTools.drawnItems = new L.FeatureGroup();

  //load any previously saved items
  plugin.drawTools.load();

  //add the draw control - this references the above FeatureGroup for editing purposes
  plugin.drawTools.addDrawControl();

  //start off hidden. if the layer is enabled, the below addLayerGroup will add it, triggering a 'show'
  $('.leaflet-draw-section').hide();


  //hide the draw tools when the 'drawn items' layer is off, show it when on
  map.on('layeradd', function(obj) {
    if(obj.layer === window.plugin.drawTools.drawnItems) {
      $('.leaflet-draw-section').show();
    }
  });
  map.on('layerremove', function(obj) {
    if(obj.layer === window.plugin.drawTools.drawnItems) {
      $('.leaflet-draw-section').hide();
    }
  });

  //add the layer
  window.addLayerGroup('Drawn Items', window.plugin.drawTools.drawnItems, true);


  //place created items into the specific layer
  map.on('draw:created', function(e) {
    var type=e.layerType;
    var layer=e.layer;
    window.plugin.drawTools.drawnItems.addLayer(layer);
    window.plugin.drawTools.save();
  });

  map.on('draw:deleted', function(e) {
    window.plugin.drawTools.save();
  });

  map.on('draw:edited', function(e) {
    window.plugin.drawTools.save();
  });
  //add options menu
  $('#toolbox').append('<a onclick="window.plugin.drawTools.manualOpt();return false;">DrawTools Opt</a>');

  $('head').append('<style>' +
        '.drawtoolsSetbox > a { display:block; color:#ffce00; border:1px solid #ffce00; padding:3px 0; margin:10px auto; width:80%; text-align:center; background:rgba(8,48,78,.9); }'+
        '.ui-dialog-drawtoolsSet-copy textarea { width:96%; height:250px; resize:vertical; }'+
        '</style>');

}


var setup =  window.plugin.drawTools.loadExternals;

// PLUGIN END //////////////////////////////////////////////////////////

@@PLUGINEND@@
