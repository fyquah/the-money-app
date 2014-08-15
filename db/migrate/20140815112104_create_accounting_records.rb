class CreateAccountingRecords < ActiveRecord::Migration
  def change
    create_table :accounting_records do |t|
      t.references :accounting_transaction , :index => true
      t.references :user , :index => true
      t.float :amount
      t.string :account_name
      t.string :account_type
      t.string :record_type
      t.timestamps
    end
  end
end
