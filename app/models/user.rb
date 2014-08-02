class User < ActiveRecord::Base
	validates :name , presence: true
	VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-])*.[a-z]+\z/i
	validates :email , uniqueness: true , presence: true , format: { with: VALID_EMAIL_REGEX }
	has_secure_password

	before_save do
		self.email.downcase!
	end
end
