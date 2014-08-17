class AddSeveralColumnsIntoAccountRecordsTable < ActiveRecord::Migration
  def change
    change_table :account_records do |t|
      t.remove :paired_record_id
      t.string :record_type
      t.integer :account_transaction_id
      t.index :account_transaction_id
    end
  end
end
