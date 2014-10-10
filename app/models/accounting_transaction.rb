class AccountingTransaction < ActiveRecord::Base
  belongs_to :account_book
  belongs_to :author , :class_name => "User" , :foreign_key => "author_id"
  has_many :debit_records , ->{ where :record_type => "debit" } , :class_name => "AccountingRecord" , :foreign_key => "accounting_transaction_id" , :dependent => :destroy
  has_many :credit_records , ->{ where :record_type => "credit" } , :class_name => "AccountingRecord" , :foreign_key => "accounting_transaction_id" , :dependent => :destroy
  accepts_nested_attributes_for :debit_records , :credit_records , :allow_destroy => true
  # validation => must be balance before saving the transaction
  validate :account_records_must_be_able_to_balance
  validate :account_type_must_be_consistent
  validates :description , :presence => true
  validates :date , :presence => true

  scope :contains_records_of , ->(account_name) do
    where(:id => AccountingRecord.where(:account_name => account_name.downcase).select(:accounting_transaction_id))
  end
  default_scope ->{ order(:date => :desc , :created_at => :desc)}

  before_save do
    debit_records.each { |r| r.account_book ||= self.account_book }
    credit_records.each { |r| r.account_book ||= self.account_book }
  end

  before_create do
    self.date ||= Time.now.to_date
  end

  def account_type_must_be_consistent
    (credit_records + debit_records).each do |record|
      existing_records = AccountingRecord.where(:account_name => record.account_name, :account_book_id => account_book_id)
      return unless existing_records.length != 0
      if existing_records[0].account_type != record.account_type
        errors.add(:account_type, "cannot be different from previously declared! (Previously declared #{record.account_name} as a/an #{existing_records[0].account_type} account, but now using it as a #{record.account_type} account)")
      end
    end
  end

  def amount
    if balance?
      debit_records.reject(&:marked_for_destruction?).inject(0 , &self.class.records_sum)
    end
  end

  def account_records_must_be_able_to_balance
    unless balance?
      errors.add(:debit_and_credit_records_amount , "do not balance")
    end
  end

  def description_cannot_be_empty_string
    errors.add(:description , "cannot be empty") if description.nil? || description.empty?
  end

  def balance?
    debit_records.reject(&:marked_for_destruction?).inject(0 , &self.class.records_sum) == credit_records.reject(&:marked_for_destruction?).inject(0 , &self.class.records_sum)
  end

  def build_paired_records options
    self.debit_records.build(options[:debit_record])
    self.credit_records.build(options[:credit_record])
    self.description = options[:description]
    self
  end

  def build_income_records options
    build_paired_records({
      :debit_record => {
        :amount => options[:amount].abs,
        :account_name => "cash",
        :account_type => "asset",
        :account_book => self.account_book
      },
      :credit_record => {
        :amount => options[:amount].abs,
        :account_name => options[:account_name],
        :account_type => "equity",
        :account_book => self.account_book
      },
      :description => options[:description]
    })
  end

  def build_expenditure_records options
    build_paired_records({
      :debit_record => {
        :amount => options[:amount].abs,
        :account_name => options[:account_name],
        :account_type => "equity",
        :account_book => self.account_book
      },
      :credit_record => {
        :amount => options[:amount].abs,
        :account_name => "cash",
        :account_type => "asset",
        :account_book => self.account_book
      },
      :description => options[:description]
    })
  end

  # Class methods
  def self.records_sum
    Proc.new do |x, record|
      x += (record.amount || 0)
    end
  end
end
