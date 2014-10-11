class CreateDebts < ActiveRecord::Migration
  def change
    create_table :debts do |t|
      t.float :amount
      t.integer :borrower_id, :index => true
      t.integer :lender_id, :index => true
      t.string :status , :default => "pending"
      t.string :description
      t.boolean :seen_by_sender , :default => false
      t.timestamps
    end
  end
end
