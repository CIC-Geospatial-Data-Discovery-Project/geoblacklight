Geoblacklight::Engine.routes.draw do
  post 'wms/handle'
  resources :download, only: [:show, :file]
  get 'download/file/:id' => 'download#file', as: :download_file
  get 'download/hgl/:id' => 'download#hgl', as: :download_hgl
  get 'catalog/:id/web_services' => 'catalog#web_services', as: 'web_services_solr_document'
  get 'catalog/:id/metadata' => 'catalog#metadata', as: 'metadata_solr_document'
end
