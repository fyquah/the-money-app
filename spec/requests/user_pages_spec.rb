require 'spec_helper'

describe "UserPages" do
	let(:base_title){ "Money App" }
	subject { page }

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