require 'spec_helper'

describe User do
	before do 
		@user = User.new name: "Quah Fu Yong" , email: "quah.fy95@gmail.com" , password: "090909" , password_confirmation: "090909"
	end
	subject { @user }

  it { should respond_to :email }
  it { should respond_to :name }
  it { should respond_to :password }
  it { should respond_to :password_confirmation }

  describe "with an invalid email" do
  	before { @user.email = "asdf" }
  	it { should_not be_valid }
  end

  describe "with a multiple case email" do
  	let(:multi_case_email){ "qUah.fY95@gmail.CoM" }
  	before do
  		@user.email = multi_case_email 
  		@user.save
  	end

  	it "should display a lowercase email after saving" do
  		expect(@user.email).to eq multi_case_email.downcase
  	end
  end

  describe "with another user registering with the same email" do
  	let(:new_user){ @new_user = User.new name: "crap" , email: @user.email , password: "090909" , password_confirmation: "090909"}
  	subject { new_user }
  	before do
  		@user.save
  	end

  	it { should_not be_valid }
  end

 	it "with valid credentials should be able to save" do
 		expect do
 			@user.save
 		end.to change(User , :count).by(1)
 	end
end
