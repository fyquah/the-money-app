app.controller("sessionsNewCtrl" , [ "$scope" , "$http" , function($scope , $http){
    (function(){
        $scope.user = {};
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
            console.log(data);
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