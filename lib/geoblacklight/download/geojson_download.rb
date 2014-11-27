class GeojsonDownload < Download
  GEOJSON_DOWNLOAD_PARAMS = {
    service: 'wfs',
    version: '2.0.0',
    request: 'GetFeature',
    srsName: 'EPSG:4326',
    outputformat: 'application/json'
  }

  def initialize(document)
    request_params = GEOJSON_DOWNLOAD_PARAMS.merge(typeName: document[:layer_id_s])
    super(document, {
      type: 'geojson',
      extension: 'json',
      request_params: request_params,
      content_type: 'application/json',
      service_type: 'wfs'
    })
  end
end
