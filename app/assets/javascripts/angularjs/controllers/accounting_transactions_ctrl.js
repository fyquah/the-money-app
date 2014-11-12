app.controller("accountingTransactionsShowCtrl" , ["$scope", "$http", "alerts", "session","$routeParams", "page", "spinner", "AccountingTransaction", function($scope, $http, alerts, session, $routeParams, page, spinner, AccountingTransaction){
    if(page.redirectUnlessSignedIn()){
        return;
    }
    spinner.start();

    AccountingTransaction.find($routeParams.id).
    then(function(accounting_transaction){
        $scope.accounting_transaction = accounting_transaction;
        $scope.edit = {
            accounting_transaction: {}
        };

        $scope.update = function(component){
            accounting_transaction.update().then(function(){
                alerts.push("success", "Successfully updated accounting transaction!");
            }, function(err){
                alerts.push("danger", err.error);
            }).finally(function(){
                spinner.stop();
            })
        };

        $scope.newRecord = function(r_type){
            $scope.new_account_record = {
                record_type: r_type
            }
            $scope.edit.add_new_record = true;
        };

        $scope.addNewRecord = function(){
            var r_type = $scope.new_account_record.record_type;
            delete $scope.new_account_record.record_type;
            if (r_type === "debit") {
                $scope.accounting_transaction.addDebitRecord($scope.new_account_record);
            } else if (r_type === "credit") {
                $scope.accounting_transaction.addCreditRecord($scope.new_account_record);
            }
            $scope.edit.add_new_record = false;
        };

        $scope.removeTransaction = function(){
            if (!confirm("Are you sure you want to remove the transation " + accounting_transaction.description + " ?")) {
                return;
            }
            accounting_transaction.remove().then(function(){
                page.redirect("/account-books/" + accounting_transaction.account_book_id);
                alerts.push("success", "transation has been removed!");
            }, function(err){
                alerts.push('danger', err.error);
            });
        }
        
    }, function(){
        return;  
    }).
    finally(function(){
        spinner.stop();
    });
}]);
