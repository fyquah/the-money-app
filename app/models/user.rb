class User < ActiveRecord::Base
  attr_accessor :pair_records

	has_secure_password
  has_many :credit_accounts_records , -> { where(:account_type => "credit") } , :foreign_key => "user_id" , :class_name => "AccountRecord"
  has_many :debit_accounts_records , -> { where(:account_type => "debit") } , :foreign_key => "user_id" , :class_name => "AccountRecord"

  validates :name , presence: true
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-])*.[a-z]+\z/i
  validates :email , uniqueness: true , presence: true , format: { with: VALID_EMAIL_REGEX }

	before_save do
    @cached_total_expenditure = @cached_total_income = nil
		self.email.downcase!
	end

  before_create do
    create_remember_token
  end
 
  after_save do 
    pair_records.each do |arr|
      arr.first.pair_record_id = arr.second.id
      arr.second.pair_record_id = arr.first.id
      arr.first.save
    end
  end

  def method_missing method , *args
    if method == :debit_accounts_amount
      debit_accounts_records.inject({} , &AccountRecord.account_records_iterator)
    elsif method == :credit_accounts_amount
      credit_accounts_records.inject({} , &AccountRecord.account_records_iterator)
    else
      super
    end
  end

  def accounts_amount
    self.debit_accounts_amount.merge self.credit_accounts_amount
  end

  def account_records query_account_name
    all_records.select { |x| x.account_name == query_account_name }
  end

  def all_records
    debit_accounts_records + credit_accounts_records
  end

  # Creating paired records
  def pair_records
    @pair_records ||= []
  end

  def create_paired_record first_record , second_record
    # Check to make sure both accounts tally first
    if first_record[:account_type] == second_record[:account_type]
      raise "Accounting balancing error : similiar account type should hold similiar value with different polarity" unless first_record[:amount] + second_record[:amount] ==  0
    else
      raise "Accounting balancing error : different account type should hold similiar value with similiar polarity" unless first_record[:amount] == second_record[:amount]
    end
    pair_records.push([create_record(first_record) , create_record(second_record)])
  end

  # Class methods
  def self.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def self.digest token
    Digest::SHA1.hexdigest token.to_s
  end

  # Private methods
  private
    def create_record acc_record
      # acc should have the follwing hash keys
      # account_type , account_name , description , amount
      self.send("#{acc_record[:account_type]}_accounts_records").build(acc_record)
    end

    def create_remember_token
      remember_token = self.class.digest(self.class.new_remember_token)
    end

end
