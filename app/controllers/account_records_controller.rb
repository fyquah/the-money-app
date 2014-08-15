class AccountRecordsController < ApplicationController
  def new
    if params[:type] == "income"
      @account_record = current_user.incomes.build
    elsif params[:type] == "expenditure"
      @account_record = current_user.expenditures.build
    else
      @account_record = AccountRecord.new
    end
  end

  def create
      
  end

  def update

  end

  def edit

  end

  def destroy

  end
end
