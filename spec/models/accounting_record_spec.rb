require 'spec_helper'

describe AccountingRecord do
  subject { @account_record = AccountRecord.new }

  it { should respond_to :paired_record }
  it { should respond_to :account_type }
  it { should respond_to :account_name }
  it { should respond_to :amount }
  it { should respond_to :description }
  
end
