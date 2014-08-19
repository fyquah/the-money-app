require 'spec_helper'

describe AccountingRecord do
  let(:user){ FactoryGirl.create(:user) }
  let(:account_book){ user.account_books.create! :name => "My first account book" }
  let(:accounting_transaction){ account_book.accounting_transactions.build }
  before do
    @accounting_record =  accounting_transaction.debit_records.build(:account_type => "liability" , :record_type => "debit" , :amount => 1000 , :account_name => "income tax")
  end
  subject { @accounting_record }

  it { should respond_to(:account_book_id) }
  it { should respond_to(:account_book) }
  it { should respond_to(:accounting_transaction) }
  it { should_not respond_to(:user) }
  it { should respond_to(:account_type) }
  it { should respond_to(:record_type) }
  it { should respond_to(:account_name) }
  it { should respond_to(:account_type) }

  describe "Some credentials" do
    describe "when account_type is missing" do
      before { @accounting_record.account_type= nil }
      it { should_not be_valid }
    end
    describe "when record_type is missing" do
      before { @accounting_record.record_type= nil }
      it { should_not be_valid }
    end
    describe "when amount is missing" do
      before { @accounting_record.amount= nil }
      it { should_not be_valid }
    end
    describe "when account_name is missing" do
      before { @accounting_record.account_name= nil }
      it { should_not be_valid }
    end
  end

  describe "when accounting record is saved " do

    it "should downcase all the accout names" do
      @accounting_record.account_name = "Income Tax"
      @accounting_record.save
      expect(@accounting_record.account_name).to eq "income tax"
    end

    it "should strip leading and trialing spaces" do
      @accounting_record.account_name = "  income tax "
      @accounting_record.save
      expect(@accounting_record.account_name).to eq "income tax" 
    end
  end

  describe "account type is either of the three main categories" do
    it "should save with ease" do
      ["liability" , "asset" , "equity"].each do |t|
        @accounting_record.account_type = t
        expect(@accounting_record).to be_valid
      end
    end

    it "should downcase them when saving and still accept them" do
      ["liabilIty" , "AsseT" , "eQuIty"].each do |t|
        @accounting_record.account_type = t
        expect(@accounting_record).to be_valid
        expect(@accounting_record.account_type).to eq t.downcase
      end
    end
  end

  describe "class method : pretty amount" do
    it "should return a 2 decimal place amount" do
      expect(AccountingRecord.pretty(123).to_s).to eq "123.00"
    end
  end
end