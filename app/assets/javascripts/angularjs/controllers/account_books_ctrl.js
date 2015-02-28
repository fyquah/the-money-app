app.controller("accountBooksNewCtrl" , ["alerts" , "page" , "$http", "$scope" , "spinner", "AccountBook", function(alerts , page, $http, $scope, spinner, AccountBook){
    if(page.redirectUnlessSignedIn()){
        return;
    }

    $scope.new_account_book = new AccountBook();

    $scope.submit = function(){
        $scope.new_account_book.create().then(function(account_book){
            page.redirect("/account-books/" + account_book.id);
        }, function(err){
            alerts.push("danger", err.error);
        })
    };
}]);

app.controller("accountBooksIndexCtrl" , ["alerts" , "page" , "$http", "$scope" , "spinner", "AccountBook" , function(alerts , page, $http, $scope, spinner, AccountBook){
    if(page.redirectUnlessSignedIn()){
        return;
    }
    spinner.start();
    // query ajax data to get all the 
    AccountBook.all().then(function(account_books){
        $scope.account_books = account_books;
    }, function(err){
        alerts.push("danger", err.error);
    }).finally(function(){
        spinner.stop();
    })
}]);

app.controller("accountBooksShowCtrl" , ["$scope", "$http", "AccountBook", "page", "spinner", "$routeParams", "alerts" , function($scope, $http, AccountBook, page, spinner, $routeParams, alerts){
    if (page.redirectUnlessSignedIn()) {
        return;
    }
    spinner.start();

    AccountBook.find($routeParams.id, false).then(function(account_book){
        $scope.account_book = account_book;
        $scope.edit = {};
        $scope.new_accounting_transaction = {};
        $scope.new_expenditure = {};
        $scope.new_income = {};

        $scope.choose = function(prop) {
            ["add_new_transaction", "add_new_expenditure", "add_new_income"].forEach(function(x){
                $scope.edit[x] = false;
            });
            $scope.edit[prop] = true;
            $scope.new_accounting_transaction = {};
            $scope.new_expenditure = {};
            $scope.new_income = {};
        };

        $scope.addNewTransaction = function(){
            account_book.addNewTransaction({
                description: $scope.new_accounting_transaction.description,
                date: $scope.new_accounting_transaction.date
            }).then(function(transaction){
                alerts.push("success", "A new transaction has been created!");
                page.redirect("/accounting-transactions/" + transaction.id)
            }, function(err){
                alerts.push("danger", err.error);
            }).finally(function(){
                $scope.edit.add_new_transaction = false;
            });
        };

        $scope.addNewExpenditure = function(){
            account_book.addNewExpenditure($scope.new_expenditure).
            then(function(){
                alerts.push("success", "Created a new expenditure record!");
            }, function(err){
                alerts.push("danger", err.error);
            }).
            finally(function(){
                $scope.edit.add_new_expenditure = false;
            });
        };

        $scope.addNewIncome = function(){
            account_book.addNewIncome($scope.new_income).
            then(function(){
                alerts.push("success", "Created a new income record!");
            }, function(err){
                alerts.push("danger", err.error);
            }).
            finally(function(){
                $scope.edit.add_new_income = false;
            });
        };

        spinner.stop();
    });

}]);

app.controller("accountBooksTransactionsCtrl" , ["alerts" , "page" , "$http", "$scope" , "spinner" , "$routeParams", "AccountBook" , function(alerts , page, $http, $scope, spinner , $routeParams, AccountBook){
    if(page.redirectUnlessSignedIn()){
        return;
    }
    spinner.start();
    $scope.edit = {};

    AccountBook.find($routeParams.id, true).then(function(account_book){
        $scope.account_book = account_book;
        spinner.stop();
        console.log(account_book);

        $scope.removeTransaction = function(id){
            if (confirm("Are you sure you want to remove transaction?")) {
                account_book.removeTransaction(id).catch(function(err){
                    alerts.push("danger", err.error);
                });
            }
        };

        $scope.addNewTransaction = function(){
            account_book.addNewTransaction({
                description: $scope.new_accounting_transaction.description,
                date: $scope.new_accounting_transaction.date
            }).then(function(){
                alerts.push("success", "A new transaction has been created!");
            }, function(err){
                alerts.push("danger", err.error);
            }).finally(function(){
                $scope.edit.add_new_transaction = false;
            })
        };

        $scope.addNewExpenditure = function(){
            account_book.addNewExpenditure($scope.new_expenditure).
            then(function(){
                alerts.push("success", "Created a new expenditure record!");
            }, function(err){
                alerts.push("danger", err.error);
            }).
            finally(function(){
                $scope.edit.add_new_expenditure = false;
            });
        };

        $scope.addNewIncome = function(){
            account_book.addNewIncome($scope.new_income).
            then(function(){
                alerts.push("success", "Created a new income record!");
            }, function(err){
                alerts.push("danger", err.error);
            }).
            finally(function(){
                $scope.edit.add_new_income = false;
            });
        };

        $scope.renameAccountBook = function(){
            console.log($scope.new_account_book_name)
            var save_promise = account_book.updateAttribute("name", $scope.account_book.name).
            then(function(){
                alerts.push("success", "Successfully renamed account book!");
            }, function(err){
                alerts.push("danger", err.error);
            }).
            finally(function(){
                $scope.edit.rename_account_book = false;
            });
        };

        $scope.removeAccountBook = function(){
            if(confirm("Are you sure you want to remove " + account_book.name + " ?")){
                account_book.remove().then(function(){
                    page.redirect("/account-books");
                    alerts.push("success", "account book " + account_book.name + " has been removed!");
                }, function(err){
                    alerts.push('danger', err.error);
                })
            }
        }

    }, null, null);
}]);

app.controller('accountBooksRecordsCtrl', ['$scope', "$http", "alerts", "session", "$routeParams", "page", "spinner", "AccountBook", "$location", function($scope, $http, alerts, session, $routeParams, page, spinner, AccountBook, $location){
    if(page.redirectUnlessSignedIn()){
        return;
    }

    spinner.start();
    AccountBook.find($routeParams.id).
    then(function(acc_book){
        $scope.account_book = acc_book; 
        return acc_book.records($routeParams.account, $routeParams.month, $routeParams.year); 
    }).
    then(function(accounts){
        $scope.accounts = accounts;
        $scope.get_particular_accounts = function(){
            var query_string_array = [];
            if (typeof $scope.particular_account_name === "string") {
                query_string_array.push("account=" + unescape($scope.particular_account_name));
            }
            if (typeof $scope.particular_month === 'string') {
                query_string_array.push("month=" + unescape($scope.particular_month));
            }
            if (typeof $scope.particular_year === "string") {
                query_string_array.push("year=" + unescape($scope.particular_year));
            }
            console.log(query_string_array);
            if (query_string_array.length === 0) {
                alerts.push("danger", "You must select at least one restriction!");
            } else {
                console.log("/account-books/" + $routeParams.id + "/records?" + query_string_array.join("&"));
                window.location.replace("/account-books/" + $routeParams.id + "/records?" + query_string_array.join("&"));
            }
        }
    }, function(err){
        alerts.push("danger", err.error);
    }).
    finally(function(){
        spinner.stop();
    });
}]);

app.controller("accountBooksBalanceSheetCtrl",  ["$scope", "$http", "alerts", "session","$routeParams", "page", "spinner", "AccountBook", function($scope, $http, alerts, session, $routeParams, page, spinner, AccountBook){
    spinner.start();
    AccountBook.find($routeParams.id).then(function(account_book){
        $scope.account_book = account_book;
        return account_book.balanceSheet();
    
    }).then(function(data){
        console.log(data);
        $scope.account_book.balance_sheet = data;
        $scope.account_book.updated_time = Date();
        console.log($scope.account_book);

    }).finally(function(){
        spinner.stop();
    });
}]);