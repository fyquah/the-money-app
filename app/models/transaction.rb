class Transaction < ActiveRecord::Base
  validates :transaction_type , :presence => true , :inclusion => ["expenditure" , "income"]
  validates :amount, :presence => true
  validates :description, :presence => true
end
