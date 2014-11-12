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
      :account_book => @account_book.as_json(account_books_as_json_params(params[:transaction]))
    })
  end

  def create
    @account_book = current_user.account_books.build(account_book_params)
    if @account_book.save
      render :status => 201 , :json => { :account_book => @account_book.as_json }
    else
      render :status => 401 , :json => { :error => @account_book.errors.full_messages }
    end
  end

  def update 
    if @account_book.update_attributes(account_book_params)
      render :status => 200 , :json => { :account_book => @account_book.as_json }
    else
      render :status => 401 , :json => { :error => @account_book.errors.full_messages }
    end
  end

  def destroy
    @account_book.destroy
    render :status => 204, :json => {}
  end

  def create_accounting_transaction
    @accounting_transaction = @account_book.accounting_transactions.build(accounting_transaction_params)
    if @accounting_transaction.save
      render :status => 201 , :json => { :accounting_transaction => @accounting_transaction.as_json(:methods => [:amount]) }
    else
      render :status => 401 , :json => { :error => @accounting_transaction.errors.full_messages }
    end
  end

  def records
    puts params[:account] , params[:year], params[:month]
    render :status => 200, :json => { :account_book_records => @account_book.accounts_based_records(params[:account], params[:month], params[:year]).as_json(:methods => [:accounting_transaction]) }
  end

  private
    def find_account_book
      @account_book = AccountBook.find(params[:id])
    end

    def account_book_must_be_editable
      unless @account_book.can_be_viewed_by? current_user
        render :json => { :error => "You are not allowed to perform the action!" } , :status => 401
      end
    end

    def account_book_must_be_viewable
      unless @account_book.can_be_edited_by? current_user
        render :json => { :error => "You are not allowed to perform the action!" } , :status => 401
      end
    end

    def account_book_must_be_owned
      unless @account_book.user == current_user
        render :json => { :error => "You are not allowed to perform the action!" } , :status => 401
      end
    end

    def account_book_params
      params.require(:account_book).permit(:name)
    end

    def accounting_transaction_params
      params.require(:accounting_transaction).permit(:id , :description, :date , :debit_records_attributes => [:id , :account_name , :amount , :account_type , :_destroy] , :credit_records_attributes => [:id , :account_name , :amount , :account_type , :_destroy])
    end

    def account_books_as_json_params with_transaction
      if with_transaction
        {
          :include => { :accounting_transactions => { :methods => [:amount] } }
        }
      else
        nil
      end
    end
end
