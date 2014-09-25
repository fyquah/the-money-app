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
        templateUrl: "/templates/static_pages/home.html",
        controller: ["page" , function(page){
            page.redirectUnlessSignedIn(undefined , false);
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
            page.redirectUnlessSignedIn();
        }]
    })
}]);

app.run(["$rootScope" , "session" , function($rootScope , session){
    $rootScope.session = session;
}]);