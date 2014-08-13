class UsersController < ApplicationController
	# GET pages to render requests
  before_action :signed_in_users_only , only: [:edit , :update]

	def new
		@user = User.new
	end

	def edit
		@user = User.find params[:id]
	end

	# Pages to handle requets
	def create
		@user = User.new user_params
		if @user.save
			flash[:success] = "Registration successful!" 
			redirect_to "/"
		else
			render 'new'
		end
	end

	def show

	end

	def update
    @user = User.find params[:id]
    if @user.update_attributes user_params
  		flash[:success] = "Updated your credentials!" 
      redirect_to edit_user_path(@user)
    else
      render 'edit'
	   end
  end

	private
		def user_params
			params.require(:user).permit :name , :email , :password , :password_confirmation
		end
end
