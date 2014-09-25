app.controller("sessionsNewCtrl" , [ "$scope" , "$http" , "currentUser" , function($scope , $http , currentUser){
    (function(){
        $scope.user = {};
        console.log(currentUser());
    })();

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
            currentUser(data);
            console.log(currentUser);
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