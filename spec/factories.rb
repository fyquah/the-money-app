FactoryGirl.define do
	factory :user do
		sequence(:name){ |n| "dummy-user-#{n}" }
		sequence(:email){ |n| "dummy-user-#{n}@gmail.com" }
		password "090909"
		password_confirmation "090909"
	end
end