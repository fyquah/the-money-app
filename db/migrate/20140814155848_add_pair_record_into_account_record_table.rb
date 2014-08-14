class AddPairRecordIntoAccountRecordTable < ActiveRecord::Migration
  def change
    add_column :account_records , :pair_record_id , :integer
    add_index :account_records , :pair_record_id
  end
end
