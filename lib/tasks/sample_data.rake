namespace :db do
  desc "Fill the database with some random data"
  task populate_users: :environment do 
    make_users
  end

  task :populate_accounting_transactions => :environment do 
    user = User.find(2)
    make_incomes(user)
    make_expenditures(user)
  end 

  task :populate_data => :environment do
    user = User.find(1)
    make_book(user)
    user.account_books.each do |book|
      make_incomes(book)
      make_expenditures(book)
    end
  end
end

def make_book user
  10.times do |n|
    user.account_books.create! :name => Faker::Name.name
  end
end

def make_users
  all_users = []
  10.times do |n|
    parameters_hash = {
      :name => Faker::Name.name,
      :email => "example-#{n}@gmail.com",
      :password => "090909" ,
      :password_confirmation => "090909"
    }
    User.create! parameters_hash
    all_users << User.last
  end
  all_users
end

def make_incomes book
  def random_income_account_name
    case SecureRandom.random_number(5)
    when 0
      "lucky draw"
    when 1
      "sales"
    when 2
      "win liao lo"
    when 3
      "wtf income"
    when 4
      "like that also can"
    end
  end

  100.times do |n|
    t = book.accounting_transactions.build
    t.build_income_records({
      :description => Faker::Lorem.sentence(13),
      :amount => (SecureRandom.random_number(100000)),
      :account_name => random_income_account_name
    })
    t.save
  end
end

def make_expenditures book
  def random_expenditure_account_name
    case SecureRandom.random_number(5)
    when 0
      "income tax"
    when 1
      "clubbing"
    when 2
      "export fees"
    when 3
      "import fees"
    when 4
      "promotion"
    end
  end

  100.times do |n|
    t = book.accounting_transactions.build
    t.build_expenditure_records({
      :description => Faker::Lorem.sentence(13),
      :amount => (SecureRandom.random_number(100000)),
      :account_name => random_expenditure_account_name
    })
    t.save
  end
end