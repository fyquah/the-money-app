Rails.application.routes.draw do

  root "templates#index"
  get "templates/:path.html" => "templates#template" , :constraints => { :path => /.+/ }

  resources :users , :format => { :default => :json } , only: [:create , :update , :show] # get stuff dealed by angularjs
  resources :sessions , :format => { :default => :json } , only: [:create]

  match "sessions/destroy" , :to => "sessions#destroy" , :via => "delete"
  match "sessions/current" , :to => "sessions#current" , :via => "get"
  match "sessions/clear_all_but_current" , :to => "sessions#clear_all_but_current" , :via => "delete"
  # For account_books
  resources :account_books , :format => { :default => :json }
  resources :accounting_transactions , :format => { :default => :json } , :only => [:update , :show , :destroy]

  get ":path" , :to => "templates#index" , :constraints => { :path => /.+/ }

  # The priority is based upon order of creation: first created -> highest priority.
  # See how all your routes lay out with "rake routes".

  # You can have the root of your site routed with "root"
  # root 'welcome#index'

  # Example of regular route:
  #   get 'products/:id' => 'catalog#view'

  # Example of named route that can be invoked with purchase_url(id: product.id)
  #   get 'products/:id/purchase' => 'catalog#purchase', as: :purchase

  # Example resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Example resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Example resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Example resource route with more complex sub-resources:
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', on: :collection
  #     end
  #   end

  # Example resource route with concerns:
  #   concern :toggleable do
  #     post 'toggle'
  #   end
  #   resources :posts, concerns: :toggleable
  #   resources :photos, concerns: :toggleable

  # Example resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end
end
