app.controller("sessionsNewCtrl" , [ "$scope" , "$http" , "session" , "page" , "User" , 
function($scope , $http , session , page , User){
    page.redirectIfSignedIn();
    $scope.user = {};
    console.log(session.currentUser());

    $scope.submit = function(){
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
            page.redirect("/home");
        }).error(function(data){
            try {
                console.log(data);
                // kemungkinan invalid credential
            } catch (e) {
                // error 5** [ISE] !!!
            }
        });
    };

}]);

app.controller("usersNewCtrl" , ["$scope" , function($scope){
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
            url: "/users/new" ,
            data: data
        }).
        success(function(data){

        }).
        error(function(data){
            
        })
    }
}]);

app.controller("alertsCtrl" , [ "alerts" , "$scope" , function(alerts , $scope){
    $scope.all = alerts.all;

    $scope.remove = alerts.remove;
    $scope.removeAll = alerts.removeAll;
}]);

app.controller("menuBarCtrl" , [ "session" , "$scope" , function(session , $scope){
    $scope.session = session;
}]);