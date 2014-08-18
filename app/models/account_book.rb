class AccountBook < ActiveRecord::Base
  has_many :accounting_transactions
  has_many :accounting_records
end
