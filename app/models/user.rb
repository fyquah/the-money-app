class User < ActiveRecord::Base
  has_secure_password
  has_many :sessions , :foreign_key => "user_id" , :class_name => "Session" , :autosave => true
  has_many :asset_records , -> { where(:account_type => "asset") } , :foreign_key => "user_id" , :class_name => "AccountingRecord"
  has_many :liability_records , -> { where(:account_type => "liability") } , :foreign_key => "user_id" , :class_name => "AccountingRecord"
  has_many :equity_records , -> { where(:account_type => "equity") } , :foreign_key => "user_id" , :class_name => "AccountingRecord"
  has_many :accounting_transactions , :foreign_key => "user_id" , :class_name => "AccountingTransaction" , :foreign_key => "user_id"

  validates :name , presence: true
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-])*.[a-z]+\z/i
  validates :email , uniqueness: true , presence: true , format: { with: VALID_EMAIL_REGEX }

  before_save do
    self.email.downcase!
  end
  after_save do

  end

  # Manaing records
  def find_account_records query_account_name
    all_records.select { |x| x.account_name == query_account_name.to_s.lowercase }
  end

  def accounts_amount # positive means debit balance, negative means credit balance
    all_records.inject({}) do |output , record|
      output[record.account_name.to_sym] ||= 0
      if record.record_type == "debit"
        output[record.account_name.to_sym] += record.amount
      else
        output[record.account_name.to_sym] -= record.amount
      end
      output
    end
  end

  def all_records
    asset_records + liability_records + equity_records
  end

  # General accounting methods
  def accounts_are_balance?
    accounts_amount.inject(0) { |o , (_ , v)| o += v } == 0
  end

  # Private methods
end
