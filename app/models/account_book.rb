class AccountBook < ActiveRecord::Base
  belongs_to :user
  has_many :accounting_transactions , :class_name => "AccountingTransaction" , :foreign_key => "account_book_id"
  has_many :asset_records , -> { where(:account_type => "asset") } , :foreign_key => "account_book_id" , :class_name => "AccountingRecord"
  has_many :liability_records , -> { where(:account_type => "liability") } , :foreign_key => "account_book_id" , :class_name => "AccountingRecord"
  has_many :equity_records , -> { where(:account_type => "equity") } , :foreign_key => "account_book_id" , :class_name => "AccountingRecord"

  validates :name , :presence => true
  validates :name , :length => { :maximum => 140 }

  def accounts_are_balance?

  end
end
