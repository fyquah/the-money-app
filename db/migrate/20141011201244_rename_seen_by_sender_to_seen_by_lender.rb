class RenameSeenBySenderToSeenByLender < ActiveRecord::Migration
  def change
    rename_column :debts, :seen_by_sender, :seen_by_lender
  end
end
