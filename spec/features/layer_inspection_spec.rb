require 'spec_helper'

feature 'Layer inspection', js: true do
  scenario 'clicking map should trigger inspection' do
    table_values = { values: [['Attribute']] }
    expect_any_instance_of(WmsLayer).to receive(:get_feature_info).and_return(table_values)
    visit catalog_path('mit-us-ma-e25zcta5dct-2000')
    find('#map').click
    expect(page).to have_css('th', text: 'Attribute')
  end
end
