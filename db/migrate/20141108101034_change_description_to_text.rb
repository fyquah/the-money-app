class ChangeDescriptionToText < ActiveRecord::Migration
  def change
    change_table :accounting_transactions do |t|
      t.change :description, :text
    end
  end
end
