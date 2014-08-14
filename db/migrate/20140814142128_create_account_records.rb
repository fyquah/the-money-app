class CreateAccountRecords < ActiveRecord::Migration
  def change
    create_table :account_records do |t|

      t.timestamps
    end
  end
end
