class AccountBooksController < ApplicationController
  before_action :signed_in_users_only

  def index
    @account_books = current_user.account_books.paginate(page: params[:page])
  end

  def new
    @account_book = current_user.account_books.build
  end

  def edit
    @account_book = AccountBook.editable_by(current_user).find(params[:id])
  end

  def show # Fancy functions should come here
    @account_book = AccountBook.viewable_by(current_user).find(params[:id])
  end

  def create
    @account_book = current_user.account_books.build(account_book_params)
    if @account_book.save
      flash[:now] = "Successfully created new account book"
      redirect_to @account_book
    else
      render 'new'
    end
  end

  def update 
    @account_book = current_user.account_books.find(params[:id])
    if @account_book && @account_book.update_attributes(account_book_params)
      flash[:now] = "Successfully updated account book"
      redirect_to @account_book
    else
      render 'edit'
    end
  end

  def destroy
  end

  private
    def account_book_params
      params.require(:account_book).permit(:name)
    end
end
