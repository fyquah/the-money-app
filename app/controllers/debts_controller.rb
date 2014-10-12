class DebtsController < ApplicationController
  before_action :signed_in_users_only
  before_action :look_up_for_debt , :only => [:show, :update, :seen, :destroy, :approve, :reject, :resolve]
  before_action :must_be_debt_parties , :only => [:show, :update]
  before_action :must_be_lender, :only => [:seen, :approve, :reject, :resolve]
  before_action :must_be_borrower, :only => [:destroy]
  JSON_CONDITIONAL_HASH = {
    :include => {
      :borrower => { :except => [:password_digest] },
      :lender => { :except => [:password_digest] }
    }
  }

  def index
    @borrowed_debts = current_user.borrowed_debts
    @lent_debts = current_user.lent_debts
    
    render :json => {
      :borrowed_debts => @borrowed_debts.as_json(JSON_CONDITIONAL_HASH),
      :lent_debts => @lent_debts.as_json(JSON_CONDITIONAL_HASH)
    }
  end

  def active
    render :json => {
      :borrowed_debts => current_user.borrowed_debts.active.as_json(JSON_CONDITIONAL_HASH),
      :lent_debts => current_user.lent_debts.active.as_json(JSON_CONDITIONAL_HASH)
    }
  end

  def archive
    render :json => {
      :borrowed_debts => current_user.borrowed_debts.archive.as_json(JSON_CONDITIONAL_HASH),
      :lent_debts => current_user.lent_debts.archive.as_json(JSON_CONDITIONAL_HASH)
    }
  end

  def show
    render :json => { :debt => @debt.as_json(JSON_CONDITIONAL_HASH) }
  end

  def create
    @debt = current_user.borrowed_debts.build(debt_params)
    print @debt.inspect
    if @debt.save
      render :json => { :debt => @debt }, :status => 201
    else
      render :json => { :error => @debt.errors.full_messages }, :status => 401
    end
  end

  def destroy
    @debt.destroy
    render :json => {}, :status => 204
  end

  def seen
    @debt.seen_by_lender = true
    if @debt.save
      render :json => {}, :status => 204
    else
      render :json => { :error => "An unkown error occured!" }, :status => 500
    end
  end

  [:approve, :reject, :resolve].each do |debt_method|
    define_method(debt_method) do
      if @debt.send(debt_method)
        render :json => {} , :status => 204
      else
        render :json => { :error => "an unkown error occured!"} , :status => 401
      end
    end
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

    def must_be_lender
      unless current_user == @debt.lender
        render :json => { :error => "You are not authorized to perform the action" }, :status => 401
      end
    end

    def must_be_borrower
      unless current_user == @debt.borrower
        render :json => { :error => "You are not authorized to perform the action" }, :status => 401
      end
    end
end
