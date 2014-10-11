class Debt < ActiveRecord::Base
  has_one :borrower, :class => "User", :foreign_key => "borrower_id"
  has_one :lender , :class => "User", :foreign_key => "lender_id"
  validates :status, :inclusion => ["rejected", "pending", "resolved", "approved"]
  
  def reject
    status = "rejected"
  end

  def accept
    status = "approved"
  end

  def resolve
    status = "resolved"
  end
end
