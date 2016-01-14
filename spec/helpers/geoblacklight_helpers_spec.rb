require 'spec_helper'

describe GeoblacklightHelper, type: :helper do
  include GeoblacklightHelper
  include ActionView::Helpers::UrlHelper
  include ActionView::Helpers::TranslationHelper
  describe '#render_facet_links' do
    it 'should contain unique links' do
      expect(self).to receive(:catalog_index_path).exactly(3).times.and_return('http://example.com/catalog?f[dc_subject_sm][]=category')
      html = Capybara.string(render_facet_links('dc_subject_sm', ['Test', 'Test', 'Earth', 'Science']))
      expect(html).to have_css 'a', count: 3
      expect(html).to have_css 'a', text: 'Test', count: 1
      expect(html).to have_css 'a', text: 'Earth', count: 1
      expect(html).to have_css 'a', text: 'Science', count: 1
    end
  end

  describe '#geoblacklight_icon' do
    it 'lowercases and subs spaces for hyphens' do
      html = Capybara.string(geoblacklight_icon('TEst 123'))
      expect(html).to have_css '.geoblacklight-test-123'
    end
  end

  describe '#proper_case_format' do
    it 'returns a properly cased format' do
      expect(proper_case_format('GEOJSON')).to eq 'GeoJSON'
    end
  end

  describe '#download_text' do
    it 'returns download text concatenated with proper case format' do
      expect(download_text('GEOJSON')).to eq 'Download GeoJSON'
    end
  end

  describe '#geoblacklight_basemap' do
    let(:blacklight_config) { double }
    it 'without configuration' do
      expect(blacklight_config).to receive(:basemap_provider).and_return(nil)
      expect(geoblacklight_basemap).to eq 'mapquest'
    end
    it 'with custom configuration' do
      expect(blacklight_config).to receive(:basemap_provider).and_return('positron')
      expect(geoblacklight_basemap).to eq 'positron'
    end
  end
  describe '#render_web_services' do
    let(:reference) { double(type: 'wms') }
    it 'with a reference to a defined partial' do
      expect(helper).to receive(:render)
        .with(partial: 'web_services_wms', locals: { reference: reference })
      helper.render_web_services(reference)
    end
    it 'with a reference to a missing partial' do
      reference = double(type: 'iiif')
      # expect(helper).to receive(:render).and_raise ActionView::MissingTemplate
      expect(helper).to receive(:render)
        .with(partial: 'web_services_iiif', locals: { reference: reference })
        .and_raise ActionView::MissingTemplate.new({}, '', '', '', '')
      expect(helper).to receive(:render)
        .with(partial: 'web_services_default', locals: { reference: reference })
      helper.render_web_services(reference)
    end
  end
end
