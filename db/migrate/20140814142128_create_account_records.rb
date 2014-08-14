class CreateAccountRecords < ActiveRecord::Migration
  def change
    create_table :account_records do |t|
      t.text :description
      t.string :account_type
      t.string :account_name
      t.float :amount
      t.references :user , :index => true
    end
  end
end
