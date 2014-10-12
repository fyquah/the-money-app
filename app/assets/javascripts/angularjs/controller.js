app.controller("sessionsNewCtrl" , [ "$scope" , "$http" , "session" , "page" , "User" , "spinner" , "alerts" , "$timeout" , 
function($scope , $http , session , page , User , spinner , alerts , $timeout){
    if(page.redirectIfSignedIn()){
        return;
    }

    $scope.submit = function(){
        spinner.start();
        session.create({
            email: $scope.email,
            password: $scope.password
        }).catch(function(err){
            alerts.push("danger", err.error);
        }).finally(function(){
            spinner.stop();
        })
    };

}]);

app.controller("usersNewCtrl" , ["page" , "User" , "$scope" , "session" , "$http" , "alerts" , "$location" , function(page , User , $scope , session , $http , alerts , $location){
    page.redirectIfSignedIn();
    $scope.user = new User();

    $scope.submit = function(){
        $scope.user.create().then(function(){ // success callback
            page.redirect("/signin");
            alerts.push("info", "Created your account! You can now sign in with the credentials!");
        }, function(err){ // error callback
            alerts.push("danger", err.error);
        });
    };
}]);

app.controller("usersEditCtrl" , ["$scope", "$routeParams", "session", "User", "page", "alerts", "spinner", function($scope , $routeParams, session , User, page , alerts , spinner){
    if (session.currentUser().id.toString() !== $routeParams.id.toString()) {
        page.redirect("/dashboard");
        alerts.push("danger", "You are not authorized to view that page!");
        return;
    }
    User.find($routeParams.id).then(function(user){ //callback
        $scope.user = user;

        $scope.submit = function(){
            spinner.start();
            user.update().then(function(){
                alerts.push("success", "Updated your users' credentials!");
            }, function(){
                alerts.push("danger", err.error);
            }).finally(function(){
                spinner.stop();
            })
        }
    }, function(){ //fallback

    });
}]);

app.controller("usersShowCtrl", ["$scope", "$routeParams", "User", "alerts", "spinner", function($scope, $routeParams, User, alerts, spinner){
    spinner.start();
    User.find($routeParams.id).then(function(user){
        $scope.user = user;
    }, function(){ //fallback

    }).finally(function(){
        spinner.stop();
    });
}])

app.controller("alertsCtrl" , [ "alerts" , "$scope" , function(alerts , $scope){
    $scope.all = alerts.all;
    $scope.remove = alerts.remove;
    $scope.removeAll = alerts.removeAll;
}]);

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

app.controller("accountBooksShowCtrl" , ["alerts" , "page" , "$http", "$scope" , "spinner" , "$routeParams", "AccountBook" , function(alerts , page, $http, $scope, spinner , $routeParams, AccountBook){
    if(page.redirectUnlessSignedIn()){
        return;
    }
    spinner.start();
    $scope.edit = {};

    AccountBook.find($routeParams.id).then(function(account_book){
        $scope.account_book = account_book;
        spinner.stop();

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
    }, null, null);
}]);

app.controller('accountBooksRecordsCtrl', ['$scope', "$http", "alerts", "session", "$routeParams", "page", "spinner", "AccountBook", function($scope, $http, alerts, session, $routeParams, page, spinner, AccountBook){
    if(page.redirectUnlessSignedIn()){
        return;
    }

    spinner.start();
    AccountBook.find($routeParams.id).
    then(function(acc_book){
        $scope.account_book = acc_book; 
        return acc_book.records($routeParams.account) 
    }).
    then(function(accounts){
        $scope.accounts = accounts;
    }, function(err){
        alerts.push("danger", err.error);
    }).
    finally(function(){
        spinner.stop();
    });
}]);

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

app.controller('debtsNewCtrl', ['$scope', 'User', 'Debt', 'alerts', 'session', function($scope, User, Debt, alerts, session){    
    var new_debt = new Debt(), all_users;
    User.all().then(function(all_users){
        $scope.all_users = all_users.filter(function(user){
            return user.id != session.currentUser().id;
        })
    });

    $scope.new_debt = new_debt;
    $scope.submit = function(){
        new_debt.create().then(function(){
            alerts.push("success", "sent your debt request!");
        }, function(err){
            alerts.push("danger", err.error);
        })
    }
}]);

app.controller('debtsIndexCtrl', ['$scope', 'Debt', function($scope, Debt){
    var borrowed_debts , lent_debts;
    Debt.all().then(function(r){
        borrowed_debts = r.borrowed_debts;
        lent_debts = r.lent_debts;

        $scope.borrowed_debts = borrowed_debts;
        $scope.lent_debts = lent_debts;
        $scope.status_color_class = {
            pending: "warning",
            rejected: "danger",
            approved: "success",
            resolved: "info"
        }
    });
}]);

app.controller('debtsShowCtrl', ["$scope", "$routeParams", "Debt", "alerts", "page", function($scope, $routeParams, Debt, alerts, page){
    Debt.find($routeParams.id).then(function(debt){
        $scope.debt = debt;

        // borrower methods
        $scope.remove = function(){
            debt.remove().then(function(){
                alerts.push("success", "deleted debt request!");
                page.redirect("/debts");
            }, function(err){
                alerts.push("danger", err.error);
            });
        };

        // lender methods
        ["approve", "reject", "resolve"].forEach(function(method){
            $scope[method] = function(){
                debt[method]().then(function(){
                    alerts.push("success", "Successfully " + method + " debt request!");
                    page.redirect("/debts");
                }, function(err){
                    alerts.push("danger", err.error);
                });
            }
        });
    });
}])