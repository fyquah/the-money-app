class AddIndexToUserIdInSessions < ActiveRecord::Migration
  def change
    add_index :sessions , :user_id
  end
end
