class SessionsController < ApplicationController
  def get
    if current_user
      render :json => current_user
    else
      render :status => 204
    end
  end

  def create
    if current_user
      render :json => current_user , :status => 201
    else
      user = User.find_by(:email => params[:email])
      if user && user.authenticate(params[:password])
        render :json => user , :status => 201
      else
        render :json => { :error => "user and password combination incorrect!" }
      end  
    end
  end

  def destroy
    sign_out
    redirect_to root_url
  end

  def clear_sessions_except_current
    store_location
    sign_out_from_other_devices(current_user)
    flash[:success] = "Signed out from all other devices"
    redirect_to_or(root_url)
  end
end
