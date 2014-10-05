class AccountBooksController < ApplicationController
  before_action :find_account_book, :except => [:index, :create]
  before_action :signed_in_users_only
  before_action :account_book_must_be_editable , :only => [:update , :create_accounting_transaction]
  before_action :account_book_must_be_viewable , :only => [:show, :records]
  before_action :account_book_must_be_owned , :only => [:destroy]

  def index
    @account_books = AccountBook.viewable_by(current_user)
    render(:json => {
      :account_books => current_user.account_books.as_json,
      :viewable_account_books => current_user.account_books.as_json,
      :editable_account_books => current_user.editable_account_books.as_json
    })
  end
  
  def show # Fancy functions should come her
    render(:json => {
      :account_book => @account_book.as_json(:include => {
          :accounting_transactions => { :methods => [:amount] }
      })
    })
  end

  def create
    @account_book = current_user.account_books.build(account_book_params)
    if @account_book.save
      render :status => 201 , :json => { :account_book => @account_book.as_json }
    else
      render :status => 400 , :json => { :error => @account_book.errors.full_messages }
    end
  end

  def update 
    if @account_book.update_attributes(account_book_params)
      render :status => 200 , :json => { :account_book => @account_book.as_json }
    else
      render :status => 400 , :json => { :error => @account_book.errors.full_messages }
    end
  end

  def destroy
  end

  def create_accounting_transaction
    @accounting_transaction = @account_book.accounting_transactions.build(accounting_transaction_params)
    if @accounting_transaction.save
      render :status => 201 , :json => { :accounting_transaction => @accounting_transaction.as_json }
    else
      render :status => 400 , :json => { :error => @accounting_transaction.errors.full_messages }
    end
  end

  def records
    render :status => 200, :json => { :account_book_records => @account_book.accounts_based_records.as_json(:methods => [:accounting_transaction]) }
  end

  private
    def find_account_book
      @account_book = AccountBook.find(params[:id])
    end

    def account_book_must_be_editable
      unless @account_book.can_be_viewed_by? current_user
        render :json => { :error => "You are not authorized to peform this action" } , :status => 401
      end
    end

    def account_book_must_be_viewable
      unless @account_book.can_be_edited_by? current_user
        render :json => { :error => "You are not authorized to peform this action" } , :status => 401
      end
    end

    def account_book_must_be_owned
      unless @account_book.user == current_user
        render :json => { :error => "You are not authorized to peform this action! Only account book owners can destroy the account book!" } , :status => 401
      end
    end

    def account_book_params
      params.require(:account_book).permit(:name)
    end

    def accounting_transaction_params
      params.require(:accounting_transaction).permit(:id , :description, :date , :debit_records_attributes => [:id , :account_name , :amount , :account_type , :_destroy] , :credit_records_attributes => [:id , :account_name , :amount , :account_type , :_destroy])
    end
end
