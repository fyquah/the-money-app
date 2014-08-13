class CreateTransactions < ActiveRecord::Migration
  def change
    create_table :transactions do |t|
      t.integer :user_id
      t.string :transaction_type
      t.index :user_id
      t.text :description
      t.timestamps
    end
  end
end
