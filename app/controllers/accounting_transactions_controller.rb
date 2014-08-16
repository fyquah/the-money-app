class AccountingTransactionsController < ApplicationController
  def index
    @accounting_transactions = current_user.accounting_transactions.paginate(page: params[:page])
  end

  def new
    @accounting_transaction = current_user.accounting_transactions.build
  end

  def edit
    @accounting_transaction = current_user.accounting_transactions.find(params[:id])
  end

  def create

  end

  def update

  end

  def detroy

  end
end
