app.config(["$httpProvider" , function($httpProvider){
    // adding csrf token
    $httpProvider.defaults.headers.common['X-CSRF-Token'] = $('meta[name=csrf-token]').attr('content')    
    // configuring for patch methods
    var defaults = $httpProvider.defaults.headers;
    defaults.patch = defaults.patch || {}
    defaults.patch["Content-Type"] = "application/json"
}]);

app.config([ "$routeProvider", "$locationProvider", function($routeProvider , $locationProvider ){
    $locationProvider.html5Mode(true);

    // var i , action , ctrl, controllers = {
    //     tasks: ["view" , "new" , "index"]
    // }; // key is namespace , content in arrary is actual controller name

    // for (ctrl in controllers) {
    //     controllers[ctrl].forEach(function(action , index){
    //         var controller_name = ctrl.toLowerCase() + action[0].toUpperCase() + action.toLowerCase().slice(1) + "Ctrl" ,
    //             template_url = "templates/" + ctrl.toLowerCase() + "/" + action.toLowerCase() + ".html" ,
    //             route_name = "/" + ctrl + "/" + action
    //         $routeProvider.when(route_name , {
    //             controller: controller_name,
    //             templateUrl: template_url
    //         });
    //         console.log(controller_name);
    //         console.log(template_url);
    //     });
    // }

    $routeProvider.when("/" , {
        template: "<div ng-bind='loading_msg'></div>",
        controller: ["page" , "$interval" , "session" , "$scope" , function(page , $interval , session , $scope){
            $interval(function(){
                var counter = 0;
                return function(){
                    var i;
                    counter = (counter + 1) % 5;
                    $scope.loading_msg = "Cooking up some awesomeness ";
                    for(i = 0 ; i < counter + 1 ; i++) {
                        $scope.loading_msg += ".";
                    }
                };
            }() , 500);
            if (session.currentUser()) {
                page.redirect("home");
            } else {
                page.redirect("signin");
            }
        }]
    }).
    when("/signin" , {
        templateUrl: "/templates/sessions/new.html",
        controller: "sessionsNewCtrl"
    }).
    when("/register" , {
        templateUrl: "/templates/users/new.html",
        controller: "usersNewCtrl"
    }).
    when("/users/:id/edit" , {
        templateUrl: "/templates/users/edit.html",
        controller: "usersEditCtrl"
    }).
    when("/home" , {
        templateUrl: "/templates/static_pages/home.html",
        controller: ["page" , function(page){
            page.redirectUnlessSignedIn("/signin", false);
            page.redirectIfSignedIn("/account-books", false);
        }]
    }).
    when("/account-books" , {
        templateUrl: "/templates/account_books/index.html",
        controller: "accountBooksIndexCtrl"
    }).
    when("/account-books/new" , {
        templateUrl: "/templates/account_books/new.html",
        controller: "accountBooksNewCtrl"
    }).
    when("/account-books/:id" , {
        templateUrl: "/templates/account_books/show.html",
        controller: "accountBooksShowCtrl"
    }).
    when("/account-books/:id/records", {
        templateUrl: "/templates/account_books/records.html",
        controller: "accountBooksRecordsCtrl"
    }).
    when("/accounting-transactions/:id", {
        templateUrl: "/templates/accounting_transactions/show.html",
        controller: "accountingTransactionsShowCtrl"
    }).
    when("/debts/new", {
        templateUrl: "/templates/debts/new.html",
        controller: "debtsNewCtrl"
    }).
    when("/debts/:id", {
        templateUrl: "/templates/debts/show.html",
        controller: "debtsShowCtrl"
    }).
    when("/debts", {
        templateUrl: "/templates/debts/index.html",
        controller: "debtsIndexCtrl"
    }).
    when("/error", {
        templateUrl: "/templates/error.html"
    }).
    otherwise({
        templateUrl: "/templates/404.html"
    })
}]);

app.run(["$rootScope" , "session" , function($rootScope , session){
    $rootScope.session = session;
}]);