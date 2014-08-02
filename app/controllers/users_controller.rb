class UsersController < ApplicationController
	# GET pages to render requests
	def new
		@user = User.new
	end

	def edit

	end

	# Pages to handle requets
	def create
		@user = User.new user_params
		if @user.save
			
		else
			render 'new'
		end
	end

	def show

	end

	def update

	end

	private
		def user_params
			params.require(:user).permit :name , :email , :password , :password_confirmation
		end
end
