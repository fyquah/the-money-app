class AccountingRecord < ActiveRecord::Base
  # Simply because it is sistem catatn bergu lol
  belongs_to :user
  has_many :accounting_transactions , :class_name => "AccountingTransaction" , :foreign_key => "accounting_transaction_id"

  validates :account_type , :presence => true , :inclusion => ["liability" , "asset" , "equity"]
  validates :record_type , :presence => true , :inclusion => ["debit" , "credit"]
  validates :amount, :presence => true , numericality: true
  validates :account_name , :presence => true

  before_save do
    account_name.downcase!
    account_type.downcase!
  end

  def pretty_amount
    "%.2f" % amount
  end

  def self.account_records_iterator
    Proc.new do |obj , record|
      if obj[record.account_name.to_sym].nil?
        obj[record.account_name.to_sym] = record.amount
      else
        obj[record.account_name.to_sym] += record.amount
      end
      obj
    end
  end

end
 