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

  def get_account_type account_name
    if asset_records.where(:account_name => account_name).count > 0
      "asset"
    elsif equity_records.where(:account_name => account_name).count > 0
      "equity"
    elsif liability_records.where(:account_name => account_name).count > 0
      "liability"
    end
  end

  def balance_sheet
    asset_amounts = {}
    equity_amounts = {}
    liability_amounts = {}
    accounts_amount.each do |acc_name, amount|
      acc_type = get_account_type(acc_name)
      if acc_type == "asset"
        asset_amounts[acc_name.to_sym] = amount
      elsif acc_type == "equity"
        equity_amounts[acc_name.to_sym] = -amount
      elsif acc_type == "liability"
        liability_amounts[acc_name.to_sym] = -amount
      end
    end
    {
      :asset => asset_amounts,
      :equity => equity_amounts,
      :liability => liability_amounts
    }
  end

  def all_records acc_name = nil
    if acc_name
      (asset_records.where(:account_name => acc_name) + liability_records.where(:account_name => acc_name) + equity_records.where(:account_name => acc_name))
    else
      asset_records + liability_records + equity_records
    end
  end

  def accounts_based_records acc_name , month, year
    all_records(acc_name).inject({}) do |memo, record|
      if acc_name == nil || acc_name.strip == record.account_name.strip
        if record.in_query_range({:account_name => acc_name, :month => month, :year => year})
          memo[record.account_name.to_sym] ||= Hash[:debit_records, [], :credit_records, []]
          memo[record.account_name.to_sym][:account_type] ||= record.account_type
          if record.record_type == "debit"
            memo[record.account_name.to_sym][:debit_records] << record
          elsif record.record_type == "credit"
            memo[record.account_name.to_sym][:credit_records] << record
          end
        end
      end
      memo.each do |key, h|
        [:debit_records, :credit_records].each do |t|
          h[t].sort! do |a, b|
            a.accounting_transaction.date < b.accounting_transaction.date ? 1 : -1
          end
        end
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
