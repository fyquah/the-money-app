class CreateSessions < ActiveRecord::Migration
  def change
    create_table :sessions do |t|
      t.references :user
      t.string :remember_token
      t.timestamps
    end

    remove_column :users , :remember_token
  end
end
