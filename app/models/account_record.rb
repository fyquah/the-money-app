class AccountRecord < ActiveRecord::Base
  validates :account_type , :presence => true , :inclusion => ["debit" , "credit"]
  validates :amount, :presence => true , numericality: true
  validates :account_name , :presence => true
  validates :account_name , :uniqueness => { :scope => :user_id , :message => "You can only have an account with a name!" }

  def pretty_amount
    "%.2f" % amount
  end

  def accounts_iterator obj
    Proc.new do |record|
      if obj[record.name.to_sym] != nil
        obj[record.name.to_sym] = record.amount
      else
        obj[record.name.to_sym] += record.amount
      end
    end
  end

  def credit_accounts_amount
    @credit_accounts = {}
    credit_account_records.each(&accounts_iterator(@credit_accounts))
    @credit_accounts
  end

  def debit_accounts_amount
    @cdbit_accounts = {}
    debit_account_records.each(&accounts_iterator(@debit_accounts))
    @debit_accounts
  end

  def accounts_amount
    credit_accounts + debit_accounts
  end

  def account search_name = {}
    if search_name[:account_type] == "credit" || search_name[:account_type] == "debit"
      send(search_name[:account_type].to_sym).find_by(:account_name => search_name[:name])
    else
      debit_accounts.find_by(:account_name => search_name[:name]) + credit_accounts.find_by(:account_name => search_name[:name])
    end
  end
end
