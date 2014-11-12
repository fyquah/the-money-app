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