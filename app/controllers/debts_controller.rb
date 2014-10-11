class DebtsController < ApplicationController
  before_action :signed_in_users_only
  before_action :look_up_for_debt , :only => [:show, :update]
  before_action :must_be_debt_parties , :only => [:show, :update]

  def create
    @debt = current_user.borrowed_debts.build(debt_params)
    if @debt.save
      render :json => { :debt => @debt }, :status => 201
    else
      render :json => { :error => @debt.errors.full_messages }, :status => 401
    end
  end

  def show
    render :json => { :debt => @debt }
  end

  private
    def debt_params
      params.require(:debt).permit([:lender_id, :amount, :description])
    end

    def look_up_for_debt
      @debt = Debt.find(params[:id])
    end

    def must_be_debt_parties
      unless [ @debt.lender, @debt.borrower ].include?(current_user)
        render :json => { :error => "You are not authorized to perform the action" }, :status => 401
      end
    end
end
