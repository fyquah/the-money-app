class Debt < ActiveRecord::Base
  belongs_to :borrower, :class_name => "User", :foreign_key => "borrower_id"
  belongs_to :lender , :class_name => "User", :foreign_key => "lender_id"
  validates :status, :inclusion => ["rejected", "pending", "resolved", "approved"]
  validate :borrower_and_lender_must_be_different

  scope :active , -> { where(:status => ["pending" , "approved"]).order(:created_at => "desc") }
  scope :archive , -> { where(:status => ["resolved", "rejected"]).order(:created_at => "desc") }

  def reject
    status = "rejected"
  end

  def accept
    status = "approved"
  end

  def resolve
    status = "resolved"
  end

  # validations
  def borrower_and_lender_must_be_different
    if borrower_id == lender_id || (borrower == lender && borrower != nil)
      errors.add(:lender, "You probably can't lend money to yourself!")
    end
  end
end
