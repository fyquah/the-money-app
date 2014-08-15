require 'spec_helper'

describe AccountingTransaction do
  @transaction = Transaction.new
  subject { @transaction }

  it { should respond_to :description }
  it { should respond_to :user_id }
  it { should respond_to :created_at }
  it { should respond_to :updated_at }
end
