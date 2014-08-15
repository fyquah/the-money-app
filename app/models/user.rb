class User < ActiveRecord::Base
	has_secure_password
  has_many :asset_records , -> { where(:account_type => "asset") } , :foreign_key => "user_id" , :class_name => "AccountingRecord"
  has_many :liability_records , -> { where(:account_type => "liability") } , :foreign_key => "user_id" , :class_name => "AccountingRecord"
  has_many :equity_records , -> { where(:account_type => "equity") } , :foreign_key => "user_id" , :class_name => "AccountingRecord"
  has_many :accounting_transactions , :foreign_key => "user_id" , :class_name => "AccountingTransaction" , :foreign_key => "user_id"

  validates :name , presence: true
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-])*.[a-z]+\z/i
  validates :email , uniqueness: true , presence: true , format: { with: VALID_EMAIL_REGEX }

	before_save do
		self.email.downcase!
	end

  before_create do
    create_remember_token
  end
 
  after_save do 
    
  end

  # Manaing records
  def find_account_records query_account_name
    all_records.select { |x| x.account_name == query_account_name.to_s.lowercase }
  end

  def accounts_amount
    all_records.inject({}) do |output , record|
      output[record.account_name.to_sym] ||= 0
      output[record.account_name.to_sym] += record.amount
      output
    end
  end

  def all_records
    asset_records + liability_records + equity_records
  end

  # General accounting methods
  def accounts_are_balance?
    (total_assets) == (total_liabilities + total_equities)
  end

  def total_assets
    asset_records.inject(0){ |output , record| output += record.amount }
  end

  def total_liabilities
    liability_records.inject(0){ |output , record| output += record.amount } * -1
  end

  def total_equities
    equity_records.inject(0){ |output , record| output += record.amount } * -1
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
      self.remember_token = self.class.digest(self.class.new_remember_token)
    end

end
