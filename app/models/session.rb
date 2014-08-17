class Session < ActiveRecord::Base
  belongs_to :user , :foreign_key => "user_id" , :class_name => "User" 
  validates :remember_token, :presence => true

  def self.new_remember_token
    SecureRandom.urlsafe_base64
  end

  def self.digest token
    Digest::SHA1.hexdigest token.to_s
  end

  def self.find_user remember_token
    session = find_by(:remember_token => digest(remember_token))
    if session
      session.user
    else
      nil
    end
  end

  private
    def create_remember_token
      self.remember_token = self.class.digest(self.class.new_remember_token)
    end
end
