class UsersController < ApplicationController
	# GET pages to render requests
  before_action :signed_in_users_only , only: [:show , :edit , :update]
  before_action :authenticated_users_only , only: [:edit , :update]

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
      sign_in @user
			redirect_to "/"
		else
			render 'new'
		end
	end

	def show
    @user = current_user
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

    def authenticated_users_only
      @user = User.find(params[:id])
      unless current_user? @user
        flash[:error] = "You are not authorized to naviagate to that page"
        redirect_to root_url
      end
    end
end
