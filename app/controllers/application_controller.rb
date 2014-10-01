class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper

  protected
    def self.allow_cors(*methods)
      protect_from_forgery :with => :null_session, :only => methods
    end
end
