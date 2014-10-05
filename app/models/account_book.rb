class AccountBook < ActiveRecord::Base
  belongs_to :user
  has_and_belongs_to_many :viewable_users , :class_name => "User" , :join_table => "users_viewable_account_books" , :foreign_key => "account_book_id"
  has_and_belongs_to_many :editable_users , :class_name => "User" , :join_table => "users_editable_account_books" , :foreign_key => "account_book_id"
  has_many :accounting_transactions , :class_name => "AccountingTransaction" , :foreign_key => "account_book_id" , :dependent => :destroy
  has_many :asset_records , -> { where(:account_type => "asset").order(:created_at => :desc) } , :foreign_key => "account_book_id" , :class_name => "AccountingRecord"
  has_many :liability_records , -> { where(:account_type => "liability").order(:created_at => :desc) } , :foreign_key => "account_book_id" , :class_name => "AccountingRecord"
  has_many :equity_records , -> { where(:account_type => "equity").order(:created_at => :desc) } , :foreign_key => "account_book_id" , :class_name => "AccountingRecord"

  validates :name , :presence => true
  validates :name , :length => { :maximum => 140 }

  scope :viewable_by , ->(user){ where(:id => (user.viewable_account_books + user.account_books + user.editable_account_books)) }
  scope :editable_by , ->(user){ where(:id => (user.editable_account_books + user.account_books))}

  def can_be_viewed_by? user
    !self.class.viewable_by(user).find_by(:id => self.id).nil?
  end

  def can_be_edited_by? user
    !self.class.editable_by(user).find_by(:id => self.id).nil?
  end

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
    (asset_records + liability_records + equity_records)
  end

  def accounts_based_records
    all_records.inject({}) do |memo, record|
      memo[record.account_name.to_sym] ||= Hash[:debit_records, [], :credit_records, []]
      if record.record_type == "debit"
        memo[record.account_name.to_sym][:debit_records] << record
      elsif record.record_type == "credit"
        memo[record.account_name.to_sym][:credit_records] << record
      end
      memo
    end
  end
  # General accounting methods
  def accounts_are_balance?
    accounts_amount.inject(0) { |o , (_ , v)| o += v } == 0
  end

  # Private methods
end
