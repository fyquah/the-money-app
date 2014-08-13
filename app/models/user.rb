class User < ActiveRecord::Base
	validates :name , presence: true
	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-])*.[a-z]+\z/i
	validates :email , uniqueness: true , presence: true , format: { with: VALID_EMAIL_REGEX }
	has_secure_password

	before_save do
		self.email.downcase!
	end

  before_create do
    create_remember_token
  end

  def self.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def self.digest token
    Digest::SHA1.hexdigest token
  end

  private
    def create_remember_token
      self.remember_token = self.class.digest(self.class.new_remember_token)
    end
end
