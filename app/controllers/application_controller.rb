class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception
  include SessionsHelper

  protected
    def find_viewable_account_book
      @account_book = AccountBook.viewable_by(current_user).find(params[:account_book_id])
    end

    def find_editable_account_book
      @account_book = AccountBook.editable_by(current_user).find(params[:account_book_id])
    end
end
