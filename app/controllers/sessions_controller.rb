class SessionsController < ApplicationController
  def new #The sign in page
    if current_user
      flash[:notice] = "You are already logged in!"
      redirect_to root_url 
    else
      @user = User.new
    end
  end

  def create
    if current_user
      flash[:notice] = "You are already logged in!"
      redirect_to root_url
    end
    
    user = User.find_by(:email => params[:email])
    puts user
    if user && user.authenticate(params[:password])
      sign_in user
      flash[:success] = "Log in successful!"
      redirect_to_or user
    else
      flash.now[:error] = "Incorrect password and username combination!"
      render "new"
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
