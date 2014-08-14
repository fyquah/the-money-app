class User < ActiveRecord::Base
	validates :name , presence: true
	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-])*.[a-z]+\z/i
	validates :email , uniqueness: true , presence: true , format: { with: VALID_EMAIL_REGEX }
	has_secure_password
  has_many :credit_account_records , -> { where(:account_type => "credit") } , :foreign_key => "user_id" , :class_name => "Account"
  has_many :debit_accounts_records , -> { where(:account_type => "debit") } , :foreign_key => "user_id" , :class_name => "Account"

	before_save do
    @cached_total_expenditure = @cached_total_income = nil
		self.email.downcase!
	end

  before_create do
    create_remember_token
    credit_accounts.create! :name => "Cash"
    debit_accounts.create! 
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
    def create_remember_token
      remember_token = self.class.digest(self.class.new_remember_token)
    end
end
