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
        templateUrl: "/templates/home.html",
        controller: ["page" , function(page){
            page.redirectIfSignedIn("/dashboard");
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
    when("/users/:id", {
        templateUrl: "/templates/users/show.html",
        controller: "usersShowCtrl"
    }).
    when("/users/:id/edit" , {
        templateUrl: "/templates/users/edit.html",
        controller: "usersEditCtrl"
    }).
    when("/dashboard" , {
        templateUrl: "/templates/dashboard.html",
        controller: function(){
            var boxes = [
                { name: "Account Books", link: "/account-books" },
                { name: "Debt Requests", link: "/debts" },
                { name: "Shared Expenditure", link: "/shared-expenditures" }
            ];
            return ["page", "$scope" , function(page, $scope){
                if(page.redirectUnlessSignedIn("/", false)){
                    return;
                }

                $scope.boxes = boxes;
            }]
        }()
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