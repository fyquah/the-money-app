class SessionsController < ApplicationController
  def new #The sign in page
    @user = User.new
  end

  def create
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
end
