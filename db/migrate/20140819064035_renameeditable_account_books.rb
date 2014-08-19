class RenameeditableAccountBooks < ActiveRecord::Migration
  def change
    rename_table :editable_account_books , :user_editable_account_books
  end
end
