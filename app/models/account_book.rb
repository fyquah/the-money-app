class AccountBook < ActiveRecord::Base
  belongs_to :user
  has_many :accounting_transactions , :class_name => "AccountingTransaction" , :foreign_key => "account_book_id"
  has_many :asset_records , -> { where(:account_type => "asset").order(:created_at => :desc) } , :foreign_key => "account_book_id" , :class_name => "AccountingRecord"
  has_many :liability_records , -> { where(:account_type => "liability").order(:created_at => :desc) } , :foreign_key => "account_book_id" , :class_name => "AccountingRecord"
  has_many :equity_records , -> { where(:account_type => "equity").order(:created_at => :desc) } , :foreign_key => "account_book_id" , :class_name => "AccountingRecord"

  validates :name , :presence => true
  validates :name , :length => { :maximum => 140 }

  def find_account_records query_account_name
    all_records.select { |x| x.account_name == query_account_name.to_s.lowercase }
  end

  def accounts_amount # positive means debit balance, negative means credit balance
    all_records.inject({}) do |output , record|
      output[record.account_name.to_sym] ||= 0
      if record.record_type == "debit"
        output[record.account_name.to_sym] += record.amount
      elsif record.record_type == "credit"
        output[record.account_name.to_sym] -= record.amount
      else
        raise "invalid record type detected in database" 
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
