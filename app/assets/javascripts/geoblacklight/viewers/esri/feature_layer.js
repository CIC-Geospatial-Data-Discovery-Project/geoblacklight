//= require geoblacklight/viewers/esri

GeoBlacklight.Viewer.FeatureLayer = GeoBlacklight.Viewer.Esri.extend({

  // default feature styles
  defaultStyles: {
    'esriGeometryPoint': '', 
    'esriGeometryMultipoint': '',
    'esriGeometryPolyline': {color: 'blue', weight: 3 },
    'esriGeometryPolygon': {color: 'blue', weight: 2 }
  },

  getPreviewLayer: function() {

    // set layer url
    this.layerOptions.url = this.data.url;

    // set default style
    this.layerOptions.style = this.getFeatureStyle();

    // define feature layer
    this.esriFeatureLayer = L.esri.featureLayer(this.layerOptions);

    //setup feature inspection and opacity
    this.setupInspection(this.esriFeatureLayer);
    this.setupInitialOpacity(this.esriFeatureLayer);

    return this.esriFeatureLayer;
  },

  // override opacity control because feature layer is special
  addOpacityControl: function() {

    // define setOpacity function that works for svg elements
    this.esriFeatureLayer.setOpacity = function(opacity) {
      $('.leaflet-clickable').css({ opacity: opacity });
    };

    // add new opacity control
    this.map.addControl(new L.Control.LayerOpacity(this.esriFeatureLayer));
  },

  getFeatureStyle: function() {
    var _this = this;

    // lookup style hash based on layer geometry type and return function
    return function(feature) { 
      return _this.defaultStyles[_this.layerInfo.geometryType]; 
    };
  },

  setupInitialOpacity: function(featureLayer) {
    featureLayer.on('load', function(e) {
      featureLayer.setOpacity(0.75);
    });
  },

  pointToExtent: function(point) {
	//from http://blogs.esri.com/esri/arcgis/2010/02/08/find-graphics-under-a-mouse-click-with-the-arcgis-api-for-javascript/
	var map = this.map;
	var bounds = map.getBounds();
	var southeast = new L.latLng(bounds._southWest.lat, bounds._northEast.lng);
	var mapUnitsWidth = southeast.distanceTo(bounds._southWest);
	var mapWidthPixels = map.getSize().x;
	var tolerance = 0.05;

	//calculate map coords represented per pixel
	var pixelWidth = mapUnitsWidth / mapWidthPixels;
	//calculate map coords for tolerance in pixel
	var toleranceInMapCoords = tolerance * pixelWidth;

	var projectedPoint = map.project(point);
	var southwestProjected = L.point(projectedPoint.x - toleranceInMapCoords, projectedPoint.y - toleranceInMapCoords);
	var northeastProjected = L.point(projectedPoint.x + toleranceInMapCoords, projectedPoint.y + toleranceInMapCoords);

	//calculate & return computed extent
	return new L.latLngBounds(map.unproject(southwestProjected), map.unproject(northeastProjected));
  },

  setupInspection: function(featureLayer) {
    var _this = this;

    // inspect on click    
    featureLayer.on('click', function(e) {
      _this.appendLoadingMessage();
	var qBounds = _this.pointToExtent(e.latlng);
      // query layer at click location
      featureLayer.query()
      .returnGeometry(false)
      .intersects(qBounds)
      .run(function(error, featureCollection, response){
        if (error) {
          _this.appendErrorMessage();
        } else {
          _this.populateAttributeTable(featureCollection.features[0]);
        }
      });
    });
  }
});
