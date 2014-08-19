module AccountingTransactionsHelper
  def link_to_account_book
    link_to(@account_book.name , @account_book)
  end

end
