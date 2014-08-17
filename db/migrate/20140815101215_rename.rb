class Rename < ActiveRecord::Migration
  def change
    rename_table :transactions , :accounting_transactions
    rename_table :account_records , :accounting_records 
    change_column :accounting_records , :account_transaction_id , :accounting_transaction_id
  end
end
