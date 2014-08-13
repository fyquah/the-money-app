class AddAmountToTranscations < ActiveRecord::Migration
  def change
    add_column :transactions, :amount, :float
  end
end
