class RenameAccountViewableTable < ActiveRecord::Migration
  def change
    rename_table :users_viewable_accuont_books , :users_viewable_account_books
  end
end
