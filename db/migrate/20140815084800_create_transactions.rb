class CreateTransactions < ActiveRecord::Migration
  def change
    create_table :transactions do |t|
      t.integer :user_id
      t.string :description

      t.timestamps

      remove_column :account_records , :description
    end
  end
end
