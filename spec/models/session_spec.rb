require 'spec_helper'

describe Session do
  let(:user){ FactoryGirl.create :user }

  before do
    @session = user.sessions.build
  end

  describe "create_remember_token" do
    it "should be able to retract the user" do
      token = @session.create_remember_token
      @session.save
      expect(Session.find_user(token)).to eq @session.user
    end

    it "should create a hashed token" do
      token = @session.create_remember_token
      expect(token).not_to eq @session.remember_token
    end
  end
end
