class AddAuthorToAccountingTransactions < ActiveRecord::Migration
  def change
    add_column :accounting_transactions , :author_id , :integer
    add_index  :accounting_transactions , :author_id
  end
end
