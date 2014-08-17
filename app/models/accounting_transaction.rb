class AccountingTransaction < ActiveRecord::Base
  belongs_to :user
  has_many :debit_records , ->{ where :record_type => "debit" } , :class_name => "AccountingRecord" , :foreign_key => "accounting_transaction_id" , :dependent => :destroy
  has_many :credit_records , ->{ where :record_type => "credit" } , :class_name => "AccountingRecord" , :foreign_key => "accounting_transaction_id" , :dependent => :destroy
  accepts_nested_attributes_for :debit_records , :credit_records , :allow_destroy => true
  # validation => must be balance before saving the transaction
  validate :account_records_must_be_able_to_balance
  validate :at_least_one_debit_record
  validate :at_least_one_credit_record
  validate :description , :presence => true

  scope :contains_records_of , ->(account_name) do
    where(:id => AccountingRecord.where(:account_name => account_name.downcase).select(:accounting_transaction_id))
  end
  default_scope ->{ order(:created_at => :desc )}

  before_save do
    debit_records.each { |r| r.user = self.user }
    credit_records.each { |r| r.user = self.user }
  end

  def account_records_must_be_able_to_balance
    unless balance?
      errors.add(:debit_and_credit_records_amount , "do not balance")
    end
  end

  def at_least_one_debit_record
    errors.add(:debit_records , "should have at least one debitted account") unless debit_records.reject(&:marked_for_destruction?).size > 0
  end

  def at_least_one_credit_record
    errors.add(:credit_records , "should have at least one creditted account") unless credit_records.reject(&:marked_for_destruction?).size > 0
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
        :user => self.user
      },
      :credit_record => {
        :amount => options[:amount].abs,
        :account_name => options[:account_name],
        :account_type => "equity",
        :user => self.user
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
        :user => self.user
      },
      :credit_record => {
        :amount => options[:amount].abs,
        :account_name => "cash",
        :account_type => "asset",
        :user => self.user
      },
      :description => options[:description]
    })
  end

  # Class methods
  def self.records_sum
    Proc.new do |x, record| 
      x += record.amount
    end
  end
end