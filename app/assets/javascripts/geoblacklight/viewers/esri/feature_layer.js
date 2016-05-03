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
    this.options.url = this.data.url;

    // set default style
    this.options.style = this.getFeatureStyle();

    // define feature layer
    //this.esriFeatureLayer = L.esri.featureLayer(this.options);

    this.options.polygonOptions= {
        color: "#2d84c8"
    };

/*
    this.options.pointToLayer = function (geojson, latlng) {
    return L.circleMarker(latlng, 10, {
      color: "#2D84C8"
    });
    };
*/

    this.options.maxClusterRadius = 40;

    this.esriFeatureLayer = new L.esri.ClusteredFeatureLayer(this.options);
    //this.getFeatureCount();

    //setup feature inspection and opacity
    this.setupInspection(this.esriFeatureLayer);
    this.setupInitialOpacity(this.esriFeatureLayer);

    return this.esriFeatureLayer;
  },

  controlPreload: function() {

    // define setOpacity function that works for svg elements
    this.esriFeatureLayer.setOpacity = function(opacity) {
      $('.leaflet-clickable').css({ opacity: opacity });
    };
  },

  //return the total number of features in the layer. used to check if clustering is needed
  getFeatureCount: function(){
    return this.esriFeatureLayer.query().where("1=1").count(function(error,count){
        return count;
    });
},

  getFeatureStyle: function() {
    var _this = this;

    // lookup style hash based on layer geometry type and return function
    return function(feature) {
      return _this.defaultStyles[_this.layerInfo.geometryType];
    };
  },

  setupInitialOpacity: function(featureLayer) {
    // featureLayer.on('load', function(e) {
    //   featureLayer.setOpacity(this.options);
    // });
  },

  setupInspection: function(featureLayer) {
    var _this = this;

    //inspect on click
    featureLayer.on('click', function(e) {
      _this.appendLoadingMessage();
      _this.populateAttributeTable(e.layer.feature);

      /*
      // query layer at click location
      var bounds = _this.pointToExtent(e.latlng);
      new L.rectangle(bounds).addTo(_this.map);
      featureLayer.query()
      .returnGeometry(false)
      .intersects(bounds)
      .run(function(error, featureCollection, response){
        if (error) {
          _this.appendErrorMessage();
        } else {
          _this.populateAttributeTable(featureCollection.features[0]);
        }
      });
      */

    });
  }
});
