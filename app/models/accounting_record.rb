class AccountingRecord < ActiveRecord::Base
  belongs_to :account_book
  belongs_to :accounting_transaction , :class_name => "AccountingTransaction" , :foreign_key => "accounting_transaction_id"

  validates :account_type , :presence => true , :inclusion => ["liability" , "asset" , "equity"]
  validates :record_type , :presence => true , :inclusion => ["debit" , "credit"]
  validates :amount, :presence => true , :numericality => true
  validates :account_name , :presence => true
  validates :accounting_transaction, :presence => true # makes no sense to have a stand alone accounting record object
  validate :account_type_must_be_consistent

  before_save do
    self.account_name.downcase!
    self.account_name.strip!
    self.account_type.downcase!
    self.account_book_id = accounting_transaction.account_book.id
  end

  def account_type_must_be_consistent
    a = AccountingRecord.where(:account_name => account_name, :account_book_id => accounting_transaction.account_book_id)
      return unless a.length != 0
      if a[0].account_type != account_type
        errors.add(:account_type, "cannot be different from previously declared! (Previously declared #{account_name} as a/an #{a[0].account_type} account, but declaring it as a #{account_type} account now)")
      end
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
        obj[record.account_name.to_sym] = (record.amount || 0)
      else
        obj[record.account_name.to_sym] += (record.amount || 0)
      end
      obj
    end
  end

  def self.pretty number
    "%.2f" % number
  end

end
