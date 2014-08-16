class AccountingTransactionsController < ApplicationController
  before_action :signed_in?
  
  def index
    @accounting_transactions = current_user.accounting_transactions.paginate(page: params[:page])
  end

  def new
    @accounting_transaction = current_user.accounting_transactions.build
  end

  def edit
    @accounting_transaction = current_user.accounting_transactions.find params[:id]
  end

  def create
    @accounting_transaction = current_user.accounting_transactions.build(accounting_transaction_params)
    if @accounting_transaction.save
      flash[:success] = "recorded transaction"
      redirect_to current_user
    else
      render 'new'
    end
  end

  def update
    @accounting_transaction = current_user.accounting_transactions.find params[:id]
    if @accounting_transaction.update_attributes accounting_transaction_params
      flash[:success] = "updated transaction"
      redirect_to current_user
    else
      render 'edit'
    end
  end

  def detroy

  end

  private 
    def accounting_transaction_params
      parameters = params.require(:accounting_transaction).permit(:description , :debit_records_attributes => [:id , :account_name , :amount , :account_type] , :credit_records_attributes => [:id , :account_name , :amount , :account_type])
      puts parameters
      parameters
    end
end
