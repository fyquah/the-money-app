class AddIndexationToOptimizeDatabases < ActiveRecord::Migration
  def change
    change_table :accounting_records do |t|
      t.index [:user_id , :account_name]
      t.index [:user_id , :account_type]
      t.index [:accounting_transaction_id , :record_type] , :name => "index_accounting_records_on_transactions_and_record_type"
      # Not too necessary cuz there will only be a few records per transactions
    end

    change_table :accounting_transactions do |t|
      t.index :user_id
      t.index :description
      t.index [:user_id , :created_at] , :using => "btree" # for accounts record generation
      t.index :created_at , :using => "btree" # for accounts record generation
    end

    change_table :sessions do |t|
      t.index :remember_token
    end
  end
end
