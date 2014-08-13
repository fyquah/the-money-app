class User < ActiveRecord::Base
	validates :name , presence: true
	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-])*.[a-z]+\z/i
	validates :email , uniqueness: true , presence: true , format: { with: VALID_EMAIL_REGEX }
	has_secure_password
  has_many :expenditures , -> { where(:transaction_type => "expenditure").order(:created_at => :desc) } , :foreign_key => "user_id" , :class_name => "Transaction"
  has_many :incomes , -> { where(:transaction_type => "income").order(:created_at => :desc) } , :foreign_key => "user_id" , :class_name => "Transaction"

	before_save do
    @cached_total_expenditure = @cached_total_income = nil
		self.email.downcase!
	end

  before_create do
    create_remember_token
  end

  def total_expenditure
    @cached_total_expenditure ||= expenditures.inject(0) { |total , exp| total += exp.amount }
  end

  def total_income
    @cached_total_income ||= incomes.inject(0){ |total , inc| total += inc.amount }
  end

  def balance
    total_income - total_expenditure
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
      self.remember_token = self.class.digest(self.class.new_remember_token)
    end
end
