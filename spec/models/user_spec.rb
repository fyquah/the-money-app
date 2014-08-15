require 'spec_helper'

describe User do
	before do 
		@user = FactoryGirl.create :user
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
      FactoryGirl.create :user
 		end.to change(User , :count).by(1)
 	end

  describe "when create a new account_record" do
    describe "creating a new expenditure record" do
      before do
        @user.create_expenditure({ :account_name => "education" , :amount => 1000 , :description => "sent my son to tuition" })
        @user.save
      end
      it "should record the expenditure accordingly in both cash and expenditure accounts" do
        expect(@user.accounts_balance?).to eq true
        expect(@user.debit_accounts_records.find_by(:account_name => "education").amount).to eq 1000
        expect(@user.debit_accounts_records.find_by(:account_name => "cash").amount).to eq -1000
      end
    end

    describe "creating a new income record" do
      before do
        @user.create_income({ :account_name => "lucky draw" , :amount => 1000 , :description => "I won a lucky draw of 1000 dollars!" })
        @user.save
      end
      it "should record the income in the relevant accounts" do
        expect(@user.accounts_balance?).to eq true
        expect(@user.credit_accounts_records.find_by(:account_name => "lucky draw").amount).to eq 1000
        expect(@user.debit_accounts_records.find_by(:account_name => "cash").amount).to eq 1000
      end
    end

    describe "creating a record for the same account" do
      before do
        @user.create_income({ :account_name => "lucky draw" , :amount => 1000 , :description => "I won a lucky draw of 1000 dollars!" })
        @user.create_income({ :account_name => "lucky draw" , :amount => 1000 , :description => "I won a lucky draw of 1000 dollars! again" })
        @user.save

        it "should have the a cumulative income amount in the right accounts" do
          expect(@user.accounts_balance?).to eq true
          expect(@user.accounts_amount[:amount]).to eq 2000
          expect do
            @user.accounts.find_records("lucky draw").inject(0){ |o , e| o += e.amount }
          end.to eq 2000
        end 
      end
    end

    describe "creating several records" do
      before do
        @user.create_income({ :account_name => "pay day" , :amount => 1000 , :description => "pay day, 1000 dollars" })
        @user.create_income({ :account_name => "lottery" , :amount => 1000 , :description => "lotter, 1000 dollars" })
        @user.create_income({ :account_name => "summon" , :amount => 1000 , :description => "Summon, 1000 dollars" })
        @user.create_income({ :account_name => "crap" , :amount => 1000 , :description => "Crap, 1000 dollars" })
        @user.save
      end
      it "should be able to retract all accounts amounts from @user.accounts_amount" do
        expect(@user.accounts_amount[:'pay day']).to eq 1000
        expect(@user.accounts_amount[:'lottery']).to eq 1000
        expect(@user.accounts_amount[:'summon']).to eq 1000
        expect(@user.accounts_amount[:'crap']).to eq 1000
      end
    end

    describe "creating accounts with strange casings" do
      before do 
        @user.create_expenditure({ :account_name => "crap" , :amount => 1000 , :description => "Crap, 1000 dollars" })
        @user.create_expenditure({ :account_name => "CrAp" , :amount => 1000 , :description => "Crap, 1000 dollars" })
        @user.save
      end

      it "should lower all casings before saving" do 
        expect(@user.debit_accounts_records.where(:account_name => "cRaP").empty?).to eq true
      end
    end
  end
end
