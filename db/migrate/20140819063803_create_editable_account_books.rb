class CreateEditableAccountBooks < ActiveRecord::Migration
  def change
    create_table :editable_account_books , :id => false do |t|
      t.integer :user_id
      t.integer :account_book_id

      t.index :user_id
      t.index :account_book_id
      t.index [:user_id , :account_book_id] , :name => "index_editable_account_book_on_user_account_book"
    end
  end
end
