class AccountingTransactionsController < ApplicationController
  before_action :signed_in?
  before_action :find_viewable_account_book , :only => [:index , :show]
  before_action :find_editable_account_book , :only => [:edit , :update , :create , :new , :destroy]

  def index
    if params[:account_name].nil? || params[:account_name].empty?
      @accounting_transactions = @account_book.accounting_transactions.paginate(page: params[:page])
    else
      @accounting_transactions = @account_book.accounting_transactions.contains_records_of(params[:account_name].downcase).paginate(page: params[:page])
    end
  end

  def new
    @accounting_transaction = @account_book.accounting_transactions.build
  end

  def show
    @accounting_transaction = @account_book.accounting_transactions.find params[:id]
  end

  def edit
    @accounting_transaction = @account_book.accounting_transactions.find params[:id]
  end

  def create
    @accounting_transaction = @account_book.accounting_transactions.build(accounting_transaction_params)
    @accounting_transaction.author = current_user
    @accounting_transaction.created_at = nil if @accounting_transaction.created_at.nil? || @accounting_transaction.created_at.to_s.empty?  #Leave the task to SQL
    if @accounting_transaction.save
      flash[:success] = "recorded transaction"
      redirect_to({
        :action => "show",
        :account_book_id => @account_book.id,
        :id => @accounting_transaction.id
      })
    else
      render 'new'
    end
  end

  def update
    @accounting_transaction = @account_book.accounting_transactions.find params[:id]
    if @accounting_transaction.update_attributes accounting_transaction_params
      flash[:success] = "updated transaction"
      redirect_to({
        :action => "show",
        :account_book_id => @account_book.id,
        :id => @accounting_transaction.id
      })
    else
      render 'edit'
    end
  end

  def destroy
    @accounting_transaction = @account_book.accounting_transactions.find params[:id]
    if @accounting_transaction.destroy
      flash[:success] = "Deleted transaction!"
      redirect_to account_book_accounting_transactions_path(:account_book_id => @account_book.id , :id => @accounting_transaction.id)
    else
      flash[:error] = "Looks like an error has occured"
    end
  end

  private 
    def accounting_transaction_params
      parameters = params.require(:accounting_transaction).permit(:description , :created_at , :debit_records_attributes => [:id , :account_name , :amount , :account_type , :_destroy] , :credit_records_attributes => [:id , :account_name , :amount , :account_type , :_destroy])
      p = lambda do |_ , r| 
        if r[:_destroy].nil? || r[:_destroy].to_s.strip.empty?
          r[:_destroy] = nil  
        else
          r[:_destroy] = true
        end
      end
      parameters[:debit_records_attributes].each(&p) unless parameters[:debit_records_attributes].nil?
      parameters[:credit_records_attributes].each(&p) unless parameters[:credit_records_attributes].nil?
      puts parameters
      parameters
    end

end
