app.controller("sessionsNewCtrl" , [ "$scope" , "$http" , "session" , "page" , "User" , "spinner" , "alerts" , "$timeout" , 
function($scope , $http , session , page , User , spinner , alerts , $timeout){
    page.redirectIfSignedIn();
    $scope.user = {};
    $scope.submit = function(){
        spinner.start();
        if( !$scope.user.email && !$scope.user.password) {
            alerts.push("danger" , "user and password combination incorrect!");
            spinner.stop();
            return;
        }
        var data = {
            user: {
                email: $scope.user.email,
                password: $scope.user.password
            }
        };
        $http({
            method: "POST",
            url: "/sessions.json",
            data: data
        }).success(function(data){
            console.log(data);
            session.currentUser(new User(data.user));
            console.log(session.currentUser());
            alerts.removeAll();
            page.redirect("/home");
            alerts.push("success" , "Log in successful! Welcome to the money app");
            spinner.stop();
        }).error(function(data , status){
            try {
                console.log(data);
                // kemungkinan invalid credential
                if (status === 400 && data.error) {
                    alerts.removeAll();
                    alerts.push("danger" , data.error);
                }
            } catch (e) {
                // error 5** [ISE] !!!
                alert("an unkown error occured");
            }
            spinner.stop();
        });
    };

}]);

app.controller("usersNewCtrl" , ["page" , "User" , "$scope" , "session" , "$http" , "alerts" , "$location" , function(page , User , $scope , session , $http , alerts , $location){
    page.redirectIfSignedIn();
    (function(){
        $scope.user = {};
    })();

    $scope.submit = function(){
        var data = {
            user: {
                name: $scope.user.name,
                email: $scope.user.email,
                password: $scope.user.password,
                password_confirmation: $scope.user.password_confirmation
            }
        };
        $http({
            method: "POST" ,
            url: "/users.json" ,
            data: data
        }).
        success(function(data){
            session.currentUser(new User(data.user));
            $location.path("/home");
        }).
        error(function(data , status){;
            if (status === 400) {
                alerts.removeAll();
                angular.forEach(data.error , function(err , index , obj){
                    alerts.push({type: "danger" , msg: err});
                });
            } else {
                console.log(data);
                alert("an unkown error has occurred!");
            }
        });
    }
}]);

app.controller("usersEditCtrl" , function($scope , $http , $routeParams, session , User, page , alerts , spinner){
    if($routeParams.id.toString() !== session.currentUser().id.toString()){
        page.redirect("/home");
        alerts.push("danger" , "You are not authorized to view this page");
        return;
    }
    $scope.user = angular.copy(session.currentUser());

    $scope.submit = function(){
        var data = {
            user: $scope.user
        };
        spinner.start();
        // update then change current user into that
        $http({
            method: "PATCH",
            url: "/users/" + session.currentUser().id + ".json",
            data: data
        }).
        success(function(data){
            session.currentUser(new User(data.user));
            console.log(session.currentUser());
            alerts.push("success" , "Updated your user credentials!");
            spinner.stop();
        }).
        error(function(data , status){
            if (status === 400) {
                console.log(data);
                angular.forEach(data.error , function(err){
                    alerts.push("danger" , err);
                });
            } else {
                alert("An unkown error has happened!");
            }
            spinner.stop();
        });
    }
});

app.controller("alertsCtrl" , [ "alerts" , "$scope" , function(alerts , $scope){
    $scope.all = alerts.all;
    $scope.remove = alerts.remove;
    $scope.removeAll = alerts.removeAll;
}]);

app.controller("menuBarCtrl" , [ "session" , "$scope" , function(session , $scope){
    $scope.session = session;
}]);

app.controller("accountBooksNewCtrl" , ["alerts" , "page" , "$http", "$scope" , "spinner" , function(alerts , page, $http, $scope, spinner){
    if(page.redirectUnlessSignedIn()){
        return;
    }

    $scope.new_account_book = {};

    $scope.submit = function(){
        var data = {
            account_book: {
                name: $scope.new_account_book.name
            }
        };
        $http({
            method: "POST",
            url: "/account_books.json",
            data: data
        }).
        success(function(data){
            // console.log(da)
            page.redirect("/account-books/" + data.account_book.id)
        }).
        error(function(data, status){
            console.log(data);
        })
    }
}]);

app.controller("accountBooksIndexCtrl" , ["alerts" , "page" , "$http", "$scope" , "spinner" , function(alerts , page, $http, $scope, spinner){
    if(page.redirectUnlessSignedIn()){
        return;
    }
    // query ajax data to get all the 
    $http({
        method: "GET",
        url: "/account_books.json"
    }).
    success(function(data){
        $scope.account_books = data.account_books;
        spinner.stop();
    }).
    error(function(data , status){
        
        spinner.stop();
    });
}]);

app.controller("accountBooksShowCtrl" , ["alerts" , "page" , "$http", "$scope" , "spinner" , "$routeParams" , function(alerts , page, $http, $scope, spinner , $routeParams){
    if(page.redirectUnlessSignedIn()){
        return;
    }
    spinner.start();
    $scope.edit = {};
    // query ajax data to get all the 
    $http({
        method: "GET",
        url: "/account_books/" + $routeParams.id + ".json"
    }).
    success(function(data){
        var i , all_transactions;
        $scope.account_book = data.account_book;
        console.log(data);
        spinner.stop();
    }).
    error(function(data , status){
        
        spinner.stop();
    });

    $scope.removeTransaction = function(index){
        var transaction = $scope.account_book.accounting_transactions[index];
        if (!confirm("Are you sure you want to delete transaction described by " + transaction.description + " which occured on the " + transaction.date )) {
            return;
        }
        $scope.account_book.accounting_transactions.splice(index , 1);
        $http({
            method: "DELETE",
            url: "/accounting_transactions/" + transaction.id + ".json",
        }).success(function(){
            console.log("removed");
        }).error(function(data){
            $scope.account_book.accounting_transactions.splice(index , 0 , transaction);
        })
    };

    $scope.addNewTransaction = function(){
        var data = {
            accounting_transaction: {
                description: $scope.new_accounting_transaction.description,
                date: $scope.new_accounting_transaction.date
            }
        };
        $http({
            method: "POST",
            url: "/account_books/" + $routeParams.id + "/create_accounting_transaction.json",
            data: data,
        }).
        success(function(data, status){
            $scope.edit.add_new_transaction = false;
            page.redirect("/accounting-transactions/" + data.accounting_transaction.id);           
        }).
        error(function(data, status){
            $scope.edit.add_new_transaction = false;
            alerts.push("danger", "error adding new transaction!");
        })
    }
}]);

app.controller("accountingTransactionsShowCtrl" , ["$scope", "$http", "alerts", "session","$routeParams", "page", "spinner", function($scope, $http, alerts, session, $routeParams, page, spinner){
    page.redirectUnlessSignedIn();
    spinner.start();

    $http({
        method: "GET",
        url: "/accounting_transactions/" + $routeParams.id + ".json"
    }).
    success(function(data){
        // data = data.accounting_transaction;
        console.log(data);
        $scope.accounting_transaction = data.accounting_transaction;
        $scope.accounting_transaction.amount = function(){
            var reduce_fnc = function(memo, record, index){
                var x = record._destroy ? 0 : (record.amount || 0);
                return memo + Number(x);
            }
            var d = $scope.accounting_transaction.debit_records.reduce(reduce_fnc, 0),
                c = $scope.accounting_transaction.credit_records.reduce(reduce_fnc, 0);
            return (d === c ? d : ("NOT BALANCED!"));
        };
        spinner.stop();
    }).
    error(function(data, status){
        alerts.push("danger", "An unkown error occured!");
        spinner.stop();
    });

    $scope.edit = {
        accounting_transaction: {}
    };

    $scope.update = function(component){
        spinner.start();
        var save_promise, data = {};
        if (component === "records") {
            ["debit_records" , "credit_records"].forEach(function(prop){
                data[prop + "_attributes"] = $scope.accounting_transaction[prop];
            });
        }
        else if (component) { // update one component
            data[component] = $scope.accounting_transaction[component];
        } else { // update everything
            for (var prop in $scope.accounting_transaction) {
                data[prop] = $scope.accounting_transaction[prop];
            }
            console.log(data);
        }
        save_promise = $http({
            method: "PATCH",
            url: "/accounting_transactions/" + $routeParams.id + ".json",
            data: {
                accounting_transaction: data
            }
        }).
        success(function(data){
            alerts.push("success", "updated your " + component);
            spinner.stop();
        }).
        error(function(data){
            alerts.push("danger", "Error updating " + component);
            spinner.stop();
        });
    };

    $scope.prompt_record = function(r_type) {
        $scope.new_account_record = {
            record_type: r_type
        }
        $scope.edit.add_new_record = true;
    };

    $scope.addNewRecord = function(){
        var r_type = $scope.new_account_record.record_type;
        delete $scope.new_account_record.record_type;
        if (r_type === "debit") {
            $scope.accounting_transaction.debit_records.push($scope.new_account_record);
        } else if (r_type === "credit") {
            $scope.accounting_transaction.credit_records.push($scope.new_account_record);
        }
        $scope.edit.add_new_record = false;
    };

    $scope.removeRecord = function(r_type, index){

    }
}])