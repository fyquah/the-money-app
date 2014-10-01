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

app.controller("accountBooksIndexCtrl" , ["alerts" , "page" , "$http", "$scope" , "spinner" , function(alerts , page, $http, $scope, spinner){
    if(page.redirectUnlessSignedIn()){
        return;
    }
    spinner.start();
    // query ajax data to get all the 
    $http({
        method: "GET",
        url: "/account_books.json"
    }).
    success(function(data){
        $scope.account_books = angular.fromJson(data.account_books);
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
    // query ajax data to get all the 
    $http({
        method: "GET",
        url: "/account_books/" + $routeParams.id + ".json"
    }).
    success(function(data){
        var i , all_transactions;
        $scope.account_book = angular.fromJson(data.account_book);
        console.log(data);
        spinner.stop();
    }).
    error(function(data , status){
        
        spinner.stop();
    });

    $scope.removeTransaction = function(index){
        var transaction = $scope.account_book.accounting_transactions[index];
        $scope.account_book.accounting_transactions.splice(index , 1);
        $http({
            method: "DELETE",
            url: "/accounting_transactions/" + transaction.id + ".json",
        }).success(function(){
            console.log("removed");
        }).error(function(data){
            $scope.account_book.accounting_transactions.splice(index , 0 , transaction);
        })
    }
}]);