class CreateViewableAccountBooks < ActiveRecord::Migration
  def change
    create_table :users_viewable_accuont_books , :id => false do |t|
      t.integer :user_id
      t.integer :account_book_id

      t.index :user_id
      t.index :account_book_id
      t.index [:user_id , :account_book_id] , :name => "index_viewable_account_books_user_account_book"
    end
  end
end
