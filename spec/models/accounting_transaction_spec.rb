require 'spec_helper'

describe AccountingTransaction do
  let(:user){ FactoryGirl.create :user }
  let(:account_book){ user.account_books.create!(:name => "Some account book") }
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
    @accounting_transaction = account_book.accounting_transactions.build
  end
  
  subject { @accounting_transaction }

  it { should respond_to :description }
  it { should respond_to :account_book_id }
  it { should respond_to :created_at }
  it { should respond_to :updated_at }
  it { should respond_to :account_book }
  it { should respond_to :debit_records }
  it { should respond_to :credit_records }

  describe "the balance? method" do
    describe "when debit and credit records do not tally" do
      before do
        @accounting_transaction.debit_records.build :account_name => "a" , :account_type => "equity" , :amount => 100
        @accounting_transaction.credit_records.build :account_name => "ab" , :account_type => "cash" , :amount => 1000
      end
      it { should_not be_valid }
      it "should not be balanced" do
        expect(@accounting_transaction.balance?).to be false
      end
      it "should not change the transactions count when saved" do
        expect do 
          @accounting_transaction.save
        end.not_to change(AccountingTransaction , :count)
      end
      it "should cause account_book not to be vaild" do
        expect do
          account_book.save
        end.not_to change(AccountingTransaction , :count)
        expect(account_book.save).to be false
      end
    end

    describe "when debit and credit_records tally" do
      before do
        @accounting_transaction.debit_records.build :account_name => "debitted acount" , :account_type => "equity" , :amount => 100
        @accounting_transaction.credit_records.build :account_name => "creditted acount" , :account_type => "asset" , :amount => 100
      end
      it { should be_valid }
      its(:balance?){ should be true }
    end
  end

  describe "when creating a new income" do
    before do
      @accounting_transaction.build_income_records(sample_expenditure_options)
    end
  end

  describe "when creating a new expenditure" do
    before do
      @accounting_transaction.build_expenditure_records(sample_expenditure_options)
      @accounting_transaction.save
    end
    it "should create a new equity entry in account_book" do
      expect(account_book.equity_records.empty?).to be false
    end
    it "should create a new asset entry in account_book" do
      expect(account_book.asset_records.empty?).to be false
    end
    it "should create a new accounting_transaction" do
      expect{account_book.accounting_transactions.find(@accounting_transaction.id)}.not_to raise_exception
    end
    it "should debit the equity account" do
      expect(@accounting_transaction.debit_records.first.account_name).to eq sample_expenditure_options[:account_name] 
      expect(@accounting_transaction.debit_records.first.amount).to eq sample_expenditure_options[:amount] 
      expect(@accounting_transaction.debit_records.first.record_type).to eq "debit"
      expect(@accounting_transaction.debit_records.first.account_type).to eq "equity" 
    end
    it "should credit the asset account" do
      expect(@accounting_transaction.credit_records.first.account_name).to eq "cash" 
      expect(@accounting_transaction.credit_records.first.amount).to eq sample_expenditure_options[:amount]
      expect(@accounting_transaction.credit_records.first.record_type).to eq "credit"
      expect(@accounting_transaction.credit_records.first.account_type).to eq "asset" 
    end
  end

  describe "when creating a new income" do
    before do
      @accounting_transaction.build_income_records(sample_income_options)
      @accounting_transaction.save
    end
    it "should create a new equity entry in account_book" do
      expect(account_book.equity_records.empty?).to be false
    end
    it "should create a new asset entry in account_book" do
      expect(account_book.asset_records.empty?).to be false
    end
    it "should create a new accounting_transaction" do
      expect{account_book.accounting_transactions.find(@accounting_transaction.id)}.not_to raise_exception
    end
    it "should debit the cash account" do
      expect(@accounting_transaction.debit_records.first.account_name).to eq "cash" 
      expect(@accounting_transaction.debit_records.first.amount).to eq sample_expenditure_options[:amount] 
      expect(@accounting_transaction.debit_records.first.record_type).to eq "debit"
      expect(@accounting_transaction.debit_records.first.account_type).to eq "asset" 
    end
    it "should credit the asset account" do
      expect(@accounting_transaction.credit_records.first.account_name).to eq sample_income_options[:account_name] 
      expect(@accounting_transaction.credit_records.first.amount).to eq sample_income_options[:amount] 
      expect(@accounting_transaction.credit_records.first.record_type).to eq "credit"
      expect(@accounting_transaction.credit_records.first.account_type).to eq "equity" 
    end
  end

  describe "when creating a new paired record" do
    before do
      @accounting_transaction.build_paired_records(paired_records_options)
      account_book.save
    end

    it "should create account records in the account_book's area" do
      expect(account_book.asset_records.first).to eq @accounting_transaction.debit_records.first
      expect(account_book.equity_records.first).to eq @accounting_transaction.credit_records.first
    end
  end

  describe "when destroying a transaction " do
    before do
      @accounting_transaction.build_paired_records(paired_records_options)
      account_book.save
      @accounting_transaction.destroy
    end

    it "should remove the transaction from database" do
      expect{ AccountingTransaction.find(@accounting_transaction.id) }.to raise_exception
    end
    it "should remove the correponding records" do
      @accounting_transaction.debit_records.each do |record|
        expect{ AccountingRecords.find(record.id) }.to raise_exception
      end
      @accounting_transaction.credit_records.each do |record|
        expect{ AccountingRecords.find(record.id) }.to raise_exception
      end
    end
  end
end
