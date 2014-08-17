require 'spec_helper'

describe User do
  let(:sample_expenditure_options){ { :account_name => "income_tax" , :amount => 1000 , :description => "paid income tax of 1000 dollars"} }
  let(:sample_income_options){ { :account_name => "lottery" , :amount => 1000 , :description => "won lottery of 1000 dollars"} }
  let(:paired_records_options) do
    {
      :description => "This is the test paired record option",
      :credit_record => {
        :account_name => "lottery",
        :account_type => "equity",
        :amount => 1000,
        :user => @user
      },
      :debit_record => {
        :account_name => "cash",
        :account_type => "asset",
        :amount => 1000,
        :user => @user
      }
    }
  end
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

  describe "accounts_are_balance? method" do
    before do
      @user.accounting_transactions.build.build_paired_records paired_records_options
      @user.accounting_transactions.build.build_expenditure_records sample_expenditure_options
      @user.accounting_transactions.build.build_income_records sample_income_options
      @user.save
    end

    its(:accounts_are_balance?){ should eq true }
    
  end

  describe "account amount methods" do
    before do
      @user.accounting_transactions.build.build_paired_records(paired_records_options)
      @user.save
    end

    it "should have the accounts_amount correctly through user's accounts_amount method" do
      accounts_amount_hash = @user.accounts_amount
      expect(accounts_amount_hash[paired_records_options[:debit_record][:account_name].to_sym]).to eq(paired_records_options[:debit_record][:amount])  
    end

    it "should be able to sum up several operations involving the same user's account" do
      5.times do
        @user.accounting_transactions.build.build_paired_records(paired_records_options)
      end
      @user.save
      accounts_amount_hash = @user.accounts_amount
      expect(accounts_amount_hash[paired_records_options[:debit_record][:account_name].to_sym]).to eq(paired_records_options[:debit_record][:amount] * 6)  
    end

      it "should be able to total up assets from several operations" do
        @user.accounting_transactions.build.build_income_records(sample_income_options)
        @user.accounting_transactions.build.build_expenditure_records(sample_expenditure_options)
        @user.save
        expect(@user.accounts_amount[:cash]).to eq 1000
      end
  end
end
