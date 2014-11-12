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