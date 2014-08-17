class RenamePairRecordIntoPairedRecord < ActiveRecord::Migration
  def change
    rename_column :account_records , :pair_record_id , :paired_record_id
  end
end
