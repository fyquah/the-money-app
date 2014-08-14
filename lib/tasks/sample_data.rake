namespace :db do
  desc "Fill the database with some random data"
  task populate: :environment do 
    make_users
    10.times { |n| make_transactions(n+1) }
  end
end

def make_users
  10.times do |n|
    parameters_hash = {
      :name => Faker::Name.name,
      :email => "example-#{n}@gmail.com",
      :password => "090909" ,
      :password_confirmation => "090909"
    }
    User.create! parameters_hash
  end
end

def make_transactions user_id
  99.times do |n|
    parameters_hash = {
      :description => Faker::Lorem.sentence(5),
      :amount => n * 10,
      :user_id => user_id,
      :transaction_type => SecureRandom.random_number(2) == 0 ? "expenditure" : "income"
    }
    Transaction.create! parameters_hash
  end
end