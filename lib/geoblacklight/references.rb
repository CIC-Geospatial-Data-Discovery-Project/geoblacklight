module Geoblacklight
  # References is a geoblacklight-schema dct:references parser
  class References
    attr_reader :refs
    def initialize(document)
      @document = document
      @refs = parse_references.map { |ref| Reference.new(ref) }
    end

    def method_missing(m, *args, &b)
      references m
    end

    def format
      @document[:dc_format_s]
    end

    def references(ref_type)
      @refs.find { |reference| reference.type == ref_type }
    end

    def parse_references
      if @document[:dct_references_s].nil?
        Hash.new
      else
        JSON.parse(@document[:dct_references_s])
      end
    end

    def preferred_download
      return file_download unless download.blank?
    end

    def file_download
      { file_download: download.to_hash }
    end

    def downloads_by_format
      case format
      when 'Shapefile'
        { shapefile: wfs.to_hash, kmz: wms.to_hash }
      when 'GeoTIFF'
        { geotiff: wms.to_hash }
      end
    end

    def download_types
      downloads_by_format
    end
  end
end
