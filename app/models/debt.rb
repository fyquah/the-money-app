class Debt < ActiveRecord::Base
  belongs_to :borrower, :class_name => "User", :foreign_key => "borrower_id"
  belongs_to :lender , :class_name => "User", :foreign_key => "lender_id"
  validates :status, :inclusion => ["rejected", "pending", "resolved", "approved"]
  validates :description, :presence => true
  validates :amount, :presence => true , :numericality => true
  validates :borrower, :presence => true
  validates :lender, :presence => true
  validate :borrower_and_lender_must_be_different

  scope :active , -> { where(:status => ["pending" , "approved"]).order(:created_at => "desc") }
  scope :archive , -> { where(:status => ["resolved", "rejected"]).order(:created_at => "desc") }

  def reject
    self.status = "rejected"
    save
  end

  def approve
    self.status = "approved"
    save
  end

  def resolve
    self.status = "resolved"
    save
  end

  # validations
  def borrower_and_lender_must_be_different
    if borrower_id == lender_id || (borrower == lender && borrower != nil)
      errors.add(:lender, "You probably can't lend money to yourself!")
    end
  end
end
