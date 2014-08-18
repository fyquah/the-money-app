class CreateAccountBooks < ActiveRecord::Migration
  def change
    create_table :account_books do |t|

      t.timestamps
    end
  end
end
