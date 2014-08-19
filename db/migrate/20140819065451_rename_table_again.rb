class RenameTableAgain < ActiveRecord::Migration
  def change
    rename_table :user_editable_account_books , :users_editable_account_books
  end
end
