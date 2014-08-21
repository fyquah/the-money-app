class AddDataToAccountingTransaction < ActiveRecord::Migration
  def change
    change_table :accounting_transactions do |t|
      t.date "date"
      t.index "date" , :using => "btree"
    end

  end
end