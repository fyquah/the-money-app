require 'spec_helper'

describe "UserPages" do
	let(:base_title){ "Money App" }
	subject { page }

	describe "Edit Page" do
		let(:user){ FactoryGirl.create :user }
		before do
			visit edit_user_path(user)
		end

		it { should have_title "#{base_title} | Update Profile" }
		it { should have_button "Update Profile" }

		describe "Update with valid information" do
			before(:each) do
				fill_in "Name" , with: "Blue Panda" 
				click_button "Update Profile" 
			end

			it { should have_content "Updated your credentials!" }
			it "should not change User count" do
				expect do
					fill_in "Name" , with: "Blue Panda" 
					click_button "Update Profile"
				end.not_to change(User , :count)
			end
		end

		describe "Update with some really strange information" do
			before(:each) do
				fill_in "Email" , with: "damn this world"  
				fill_in "Password" , with: "1"
				fill_in "Password Confirmation" , with: "10"
				click_button "Update Profile"
			end

			it { should have_content "errors" }
			it { should have_title "#{base_title} | Update Profile"}
		end
	end

	describe "Sign up page" do
		before { visit "/users/new" }
		it { should have_title "#{base_title} | Sign Up" }

		describe "filling in details" do
			before(:each) do
				fill_in "Name" , with: "Quah Fu Yong"
				fill_in "Email" , with: "test_account@gmail.com"
				fill_in "Password" , with: "090909"
				fill_in "Password Confirmation" , with: "090909"
				click_button "Sign Up"
			end

			it "with valid credentails , should redirect me to the home page" do
				expect(page).to have_title base_title
			end
		end

		describe "filling in an invalid email" do
				before do
					fill_in "Email" , with: "aaa" 
					click_button "Sign Up"
				end
				it { should have_title "#{base_title} | Sign Up" }
				it { should have_content "error" }
			end

			describe "filling in different password in confirmation field" do
				before do
					fill_in "Password Confirmation" , with: "10101010"
					click_button "Sign Up" 
				end

				it { should have_title "#{base_title} | Sign Up" }
				it { should have_content "error" }
			end

		describe "leaving everything empty" do
			before { click_button "Sign Up" }
			it "should have loaddssss of erros" do
				expect(page).to have_content "errors" 
			end
		end
	end

	
end