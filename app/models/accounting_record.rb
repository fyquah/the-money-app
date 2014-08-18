class AccountingRecord < ActiveRecord::Base
  belongs_to :account_book
  belongs_to :accounting_transaction , :class_name => "AccountingTransaction" , :foreign_key => "accounting_transaction_id"

  validates :account_type , :presence => true , :inclusion => ["liability" , "asset" , "equity"]
  validates :record_type , :presence => true , :inclusion => ["debit" , "credit"]
  validates :amount, :presence => true , numericality: true
  validates :account_name , :presence => true

  before_save do
    self.account_name.downcase!
    self.account_name.strip!
    self.account_type.downcase!
  end

  def account_type= arg
    super(arg.to_s.downcase)
  end

  def account_name= arg
    super(arg.to_s.downcase)
  end

  def record_type= arg
    super(arg.to_s.downcase)
  end

  def self.account_records_iterator
    # To be used with inject
    Proc.new do |obj , record|
      if obj[record.account_name.to_sym].nil?
        obj[record.account_name.to_sym] = record.amount
      else
        obj[record.account_name.to_sym] += record.amount
      end
      obj
    end
  end

  def self.pretty number
    "%.2f" % number
  end

end
