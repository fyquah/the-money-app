class User < ActiveRecord::Base
  has_secure_password
  has_many :sessions , :foreign_key => "user_id" , :class_name => "Session" , :autosave => true
  has_many :account_books , :foreign_key => "user_id" , :class_name => "AccountBook" , :autosave => false

  validates :name , presence: true
  VALID_EMAIL_REGEX = /\A[\w+\-.]+@[a-z\d\-]+(\.[a-z\d\-])*.[a-z]+\z/i
  validates :email , uniqueness: true , presence: true , format: { with: VALID_EMAIL_REGEX }
end
