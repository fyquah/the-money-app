require 'spec_helper'

describe AccountBook do
  let(:user){ FactoryGirl.create :user }
  let(:sample_expenditure_options){ { :account_name => "income_tax" , :amount => 1000 , :description => "paid income tax of 1000 dollars"} }
  let(:sample_income_options){ { :account_name => "lottery" , :amount => 1000 , :description => "won lottery of 1000 dollars"} }
  let(:paired_records_options) do
    {
      :description => "This is the test paired record option",
      :credit_record => {
        :account_name => "lottery",
        :account_type => "equity",
        :amount => 1000
      },
      :debit_record => {
        :account_name => "bank",
        :account_type => "asset",
        :amount => 1000
      }
    }
  end

  before do
    @account_book = user.account_books.build
    @account_book.name = "My first account book"
  end
  subject { @account_book }

  it { should respond_to(:user) }
  it { should respond_to(:user_id) }
  it { should respond_to(:name) }
  it { should respond_to(:accounting_transactions) }
  it { should respond_to(:asset_records) }
  it { should respond_to(:liability_records) }
  it { should respond_to(:equity_records) }

  describe "if all credentials are correct" do
    it { should be_valid }
  end

  describe "without the name" do 
    before { @account_book.name = nil }
    it { should_not be_valid }
  end

  describe "with an name > 141 chracters" do
    before { @account_book.name = "a" * 141  }
    it { should_not be_valid }
  end

  describe "accounts_are_balance? method" do
    before do
      @account_book.accounting_transactions.build.build_paired_records(paired_records_options)
      @account_book.accounting_transactions.build.build_expenditure_records(sample_expenditure_options)
      @account_book.accounting_transactions.build.build_income_records(sample_income_options)
      @account_book.save
    end

    its(:accounts_are_balance?){ should eq true }
    
  end

  describe "account amount methods" do
    before do
      @account_book.accounting_transactions.build.build_paired_records(paired_records_options)
      @account_book.save
    end

    it "should have the accounts_amount correctly through account_book's accounts_amount method" do
      accounts_amount_hash = @account_book.accounts_amount
      expect(accounts_amount_hash[paired_records_options[:debit_record][:account_name].to_sym]).to eq(paired_records_options[:debit_record][:amount])  
    end

    it "should be able to sum up several operations involving the same account_book's account" do
      5.times do
        @account_book.accounting_transactions.build.build_paired_records(paired_records_options)
      end
      @account_book.save
      accounts_amount_hash = @account_book.accounts_amount
      expect(accounts_amount_hash[paired_records_options[:debit_record][:account_name].to_sym]).to eq(paired_records_options[:debit_record][:amount] * 6)  
    end

      it "should be able to total up assets from several operations" do
        @account_book.accounting_transactions.build.build_income_records(sample_income_options)
        @account_book.accounting_transactions.build.build_expenditure_records(sample_expenditure_options)
        @account_book.save
        expect(@account_book.accounts_amount[:cash]).to eq 0
      end
  end

  describe "additional accounting method" do
    before do
      @account_book.accounting_transactions.build.build_income_records(sample_income_options)
      @account_book.accounting_transactions.build.build_expenditure_records(sample_expenditure_options)
      @account_book.accounting_transactions.build.build_paired_records(paired_records_options)
      @account_book.save
    end

    it "should contain should have values for all accounts" do
      ["income_tax" , "lottery" , "cash" , "bank"].each do |x|
        @account_book.accounts_amount.keys.include? x
      end
    end
  end

  describe "habtm viewable relationsship with users" do
    let(:other_user){ FactoryGirl.create :user }
    before { @account_book.save }

    it "should allow creator user to be able to view account book but not directly from user himself" do
      expect(user.viewable_account_books).not_to include(@account_book)
      expect(AccountBook.viewable_by(user)).to include(@account_book)
    end

    it "should not allow other users to view initially" do
      expect(other_user.viewable_account_books).not_to include(@account_book)
      expect(AccountBook.viewable_by(other_user)).not_to include (@account_book)
      expect(@account_book.can_be_viewed_by? other_user).to be false
    end

    describe "after permiting them to view" do
      before { @account_book.viewable_users << other_user }
      it "should allow other users to view the accounts" do
        expect(other_user.viewable_account_books).to include(@account_book)
        expect(@account_book.can_be_viewed_by? other_user).to be true
      end
    end
  end

  describe "habtm editable relationship with users" do
    let(:other_user){ FactoryGirl.create(:user) }
    before{ @account_book.save }

    it "should allow creator user to be able to list as editable account, but not directly" do
      expect(user.editable_account_books).not_to include(@account_book)
      expect(AccountBook.editable_by(user)).to include(@account_book)
    end

    it "should grant view access along with edit access" do
      @account_book.editable_users << other_user
      expect(AccountBook.viewable_by(other_user)).to include(@account_book)
    end
  end

end
