class CreateAccountBooks < ActiveRecord::Migration
  def change
    create_table :account_books do |t|
      t.string :name
      t.references :user ,:add_index => true
      t.timestamps
    end

    remove_index :accounting_records , :name => "index_accounting_records_on_user_id_and_account_name"
    remove_index :accounting_records , :name => "index_accounting_records_on_user_id_and_account_type"
    remove_index :accounting_records , :name => "index_accounting_records_on_user_id"
    remove_column :accounting_records , :user_id
    change_table :accounting_records do |t|
      t.integer :account_book_id
      t.index [:account_book_id]
      t.index [:account_book_id , :account_name]
      t.index [:account_book_id , :account_type]
    end

    remove_index :accounting_transactions , :name => "index_accounting_transactions_on_user_id_and_created_at"
    remove_index :accounting_transactions , :name => "index_accounting_transactions_on_user_id"
    remove_column :accounting_transactions , :user_id
    add_column :accounting_transactions , :account_book_id , :integer
    add_index :accounting_transactions , :account_book_id
    add_index :accounting_transactions , [:account_book_id , :created_at] , :name => "index_transactions_on_account_book_and_created"
  end
end
