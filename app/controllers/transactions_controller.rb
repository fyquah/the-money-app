class TransactionsController < ApplicationController
  before_action :signed_in_users_only

  def new
    if params[:type] == "income"
      @transaction = current_user.incomes.build
    elsif params[:type] == "expenditure"
      @transaction = current_user.expenditures.build
    else
      @transaction = Transaction.new
      @transaction.user_id = current_user.id
    end
  end

  def create # Same create method for both income and expenditure
    @transaction = current_user.send("#{params[:transaction][:transaction_type]}s".to_sym).build transactions_params
    if @transaction.save
      flash[:success] = "successfully created an #{@transaction.transaction_type} record"
      redirect_to root_url
    else
      render 'new'
    end
  end

  private
    def transactions_params
      @transcations_params ||= params.require("transaction").permit :transaction_type , :description , :amount
    end
end
