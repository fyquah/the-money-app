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
        }, function(){ // error callback

        });
    };
}]);

app.controller("usersEditCtrl" , function($scope , $http , $routeParams, session , User, page , alerts , spinner){

    User.find($routeParams.id).then(function(user){ //callback
        $scope.user = user;

        $scope.submit = function(){
            spinner.start();
            user.update().then(function(){
                alerts.push("success", "Updated your users' credentials!");
            }).finally(function(){
                spinner.stop();
            })
        }
    }, function(){ //fallback

    });

    // if($routeParams.id.toString() !== session.currentUser().id.toString()){
    //     page.redirect("/home");
    //     alerts.push("danger" , "You are not authorized to view this page");
    //     return;
    // }

    // $scope.submit = function(){
    //     var data = {
    //         user: $scope.user
    //     };
    //     spinner.start();
    //     // update then change current user into that
    //     $http({
    //         method: "PATCH",
    //         url: "/users/" + session.currentUser().id + ".json",
    //         data: data
    //     }).
    //     success(function(data){
    //         session.currentUser(new User(data.user));
    //         console.log(session.currentUser());
    //         alerts.push("success" , "Updated your user credentials!");
    //         spinner.stop();
    //     }).
    //     error(function(data , status){
    //         if (status === 400) {
    //             console.log(data);
    //             angular.forEach(data.error , function(err){
    //                 alerts.push("danger" , err);
    //             });
    //         } else {
    //             alert("An unkown error has happened!");
    //         }
    //         spinner.stop();
    //     });
    // }
});

app.controller("alertsCtrl" , [ "alerts" , "$scope" , function(alerts , $scope){
    $scope.all = alerts.all;
    $scope.remove = alerts.remove;
    $scope.removeAll = alerts.removeAll;
}]);

app.controller("menuBarCtrl" , [ "session" , "$scope" , function(session , $scope){
    $scope.session = session;
}]);

app.controller("accountBooksNewCtrl" , ["alerts" , "page" , "$http", "$scope" , "spinner", "AccountBook", function(alerts , page, $http, $scope, spinner, AccountBook){
    if(page.redirectUnlessSignedIn()){
        return;
    }

    $scope.new_account_book = new AccountBook();

    $scope.submit = function(){
        $scope.new_account_book.create().then(function(account_book){
            page.redirect("/account-books/" + account_book.id);
        }).catch(function(){

        }).finally(function(){

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
    }).catch(function(){

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
            alert("Are you sure you want to remove transaction?");
            account_book.removeTransaction(id).catch(function(){
                alerts.push("danger", "An unkown error has just occured while removing transaction");
            });
        };

        $scope.addNewTransaction = function(){
            account_book.addNewTransaction({
                description: $scope.new_accounting_transaction.description,
                date: $scope.new_accounting_transaction.date
            });
        };

        $scope.renameAccountBook = function(){
            var save_promise = account_book.updateAttribute("name", $scope.account_book.name).
            catch(function(msg){
                if (msg.err) {
                    alerts.push("danger", msg.err);
                }
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
                })                
            }
        }

        $scope.addNewExpenditure = function(){
            account_book.addNewExpenditure($scope.new_expenditure).finally(function(){
                $scope.edit.add_new_expenditure = false;
            });
        };

        $scope.addNewIncome = function(){
            account_book.addNewIncome($scope.new_income).finally(function(){
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
    }).
    catch(function(){
        
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
            accounting_transaction.update().finally(function(){
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
        }
        
    }, function(){
        return;  
    }).
    finally(function(){
        spinner.stop();
    });
}]);