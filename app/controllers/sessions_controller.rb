class SessionsController < ApplicationController
  def current
    render :json => { :user => current_user } , :status => (current_user ? 200 : 204)
  end

  def create
    if current_user
      render :json => { :user => current_user } , :status => 201
    else
      user = User.find_by(:email => session_params[:email])
      if user && user.authenticate(session_params[:password])
        sign_in(user)
        render :json => { :user => user } , :status => 201
      else
        render :json => { :error => "user and password combination incorrect!" } , :status => 400
      end  
    end
  end

  def destroy
    sign_out
    render :json => {} , :status => 204 # no entity to return :)
    # redirect_to root_url
  end

  def clear_all_but_current
    store_location
    sign_out_from_other_devices(current_user)
    render :json => {} , :status => 204
    # flash[:success] = "Signed out from all other devices"
    # redirect_to_or(root_url)
  end

  private
    def session_params
      params.require(:user).permit(:email , :password)
    end
end
